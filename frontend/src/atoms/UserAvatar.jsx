import { Avatar } from '@mui/material'

function UserAvatar({ username = '', sx }) {
  return (
    <Avatar sx={{ color: 'neutral.main', bgcolor: 'background.muted', ...sx }}>
        {username.charAt(0).toUpperCase()}
      </Avatar>
  )
}

export default UserAvatar;