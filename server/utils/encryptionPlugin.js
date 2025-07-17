const { encrypt, decrypt, createHash } = require('./encryption')

/**
 * Mongoose plugin for automatic field encryption
 *
 * Usage:
 *   schema.plugin(encryptionPlugin, {
 *     fields: ['firebaseUid'],          // Fields to encrypt + create hash for lookups
 *     encryptOnly: ['email', 'phone']   // Fields to encrypt only (no hash/lookups)
 *   })
 */
function encryptionPlugin(schema, options = {}) {
  const { fields = [], encryptOnly = [] } = options
  const allEncryptedFields = [...fields, ...encryptOnly]

  // Add hash fields to schema (only for fields that need lookups)
  fields.forEach((field) => {
    const hashField = `${field}Hash`

    if (!schema.paths[hashField]) {
      schema.add({
        [hashField]: {
          type: String,
          sparse: true,
        },
      })
    }

    // Create hash index for searching
    schema.index(
      { [hashField]: 1 },
      { unique: true, sparse: true, name: `${hashField}_1_sparse` }
    )
  })

  // Pre-save middleware to encrypt sensitive fields
  schema.pre('save', function (next) {
    allEncryptedFields.forEach((field) => {
      if (this.isModified(field) && this[field]) {
        // Only encrypt if not already encrypted (doesn't contain ':')
        if (!this[field].includes(':')) {
          const originalValue = this[field]
          this[field] = encrypt(originalValue)

          // Only create hash for fields that need lookups
          if (fields.includes(field)) {
            this[`${field}Hash`] = createHash(originalValue)
          }
        }
      }
    })
    next()
  })

  // Pre-update middleware for findOneAndUpdate
  schema.pre(['findOneAndUpdate', 'updateOne'], function (next) {
    const update = this.getUpdate()

    allEncryptedFields.forEach((field) => {
      if (update[field] && !update[field].includes(':')) {
        const originalValue = update[field]
        update[field] = encrypt(originalValue)

        // Only create hash for fields that need lookups
        if (fields.includes(field)) {
          update[`${field}Hash`] = createHash(originalValue)
        }
      }
    })

    next()
  })

  // Post-find middleware to decrypt sensitive fields
  schema.post(['find', 'findOne', 'findOneAndUpdate'], function (doc) {
    if (doc) {
      const decryptDoc = (document) => {
        allEncryptedFields.forEach((field) => {
          if (document[field]) {
            document[field] = decrypt(document[field])
          }
        })
      }

      if (Array.isArray(doc)) {
        // Handle find() that returns array
        doc.forEach(decryptDoc)
      } else {
        // Handle findOne() that returns single document
        decryptDoc(doc)
      }
    }
  })

  // Add static methods for encrypted field searches (only for fields with hashes)
  fields.forEach((field) => {
    const methodName = `findBy${field.charAt(0).toUpperCase()}${field.slice(1)}`

    schema.statics[methodName] = function (value) {
      const hash = createHash(value)
      return this.findOne({ [`${field}Hash`]: hash })
    }
  })
}

module.exports = encryptionPlugin
