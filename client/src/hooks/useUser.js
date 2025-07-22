import { useQuery, useMutation } from '@apollo/client'
import { useSelector } from 'react-redux'
import {
  SYNC_USER,
  GET_USER_PROFILE,
  UPDATE_USER_PROFILE,
} from '../utils/graphql/user'

export const useUserProfile = () => {
  const user = useSelector((state) => state.user.data)

  const { data, loading, error } = useQuery(GET_USER_PROFILE, {
    variables: { firebaseUid: user?.uid },
    skip: !user?.uid,
  })

  return {
    userProfile: data?.userProfile,
    loading,
    error,
  }
}

export const useSyncUser = () => {
  const [syncUser, { loading, error }] = useMutation(SYNC_USER)
  return { syncUser, loading, error }
}

export const useUpdateUserProfile = () => {
  const [updateUserProfile, { loading, error }] =
    useMutation(UPDATE_USER_PROFILE)
  return { updateUserProfile, loading, error }
}
