import * as Yup from 'yup'

export const createValidationSchema = Yup.object({
  title: Yup.string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be at most 100 characters'),
  placeName: Yup.string()
    .required('Place name is required')
    .max(100, 'Place name must be at most 100 characters'),
  ratingId: Yup.string()
    .required('Rating is required'),
  location: Yup.string()
    .required('Location is required'),
  tags: Yup.string()
    .notRequired(),
})
