export const permission = (value) => {
  const operationMapping = {
    0x00000001: { name: 'CREATE_INSTANT_INVITE', logo: 'fa-link' },
    0x00000002: { name: 'KICK_MEMBERS', logo: 'fa-sign-out-alt' },
    0x00000004: { name: 'BAN_MEMBERS', logo: 'fa-ban' },
    0x00000008: { name: 'ADMINISTRATOR', logo: 'fa-user-tie' },
    0x00000010: { name: 'MANAGE_CHANNELS', logo: 'fa-comments' },
    0x00000020: { name: 'MANAGE_GUILD', logo: 'fa-users' },
    0x00000400: { name: 'READ_MESSAGES', logo: 'fa-book-reader' },
    0x00000800: { name: 'SEND_MESSAGES', logo: 'fa-envelope' },
    0x00001000: { name: 'SEND_TTS_MESSAGES', logo: 'fa-exclamation' },
    0x00002000: { name: 'MANAGE_MESSAGES', logo: 'fa-edit' },
    0x00004000: { name: 'EMBED_LINKS', logo: 'fa-paperclip' },
    0x00008000: { name: 'ATTACH_FILES', logo: 'fa-file-upload' },
    0x00010000: { name: 'READ_MESSAGE_HISTORY', logo: 'fa-history' },
    0x00020000: { name: 'MENTION_EVERYONE', logo: 'fa-at' },
    0x00100000: { name: 'CONNECT', logo: 'fa-wifi' },
    0x00200000: { name: 'SPEAK', logo: 'fa-microphone-alt' },
    0x00400000: { name: 'MUTE_MEMBERS', logo: 'fa-microphone-alt-slash' },
    0x00800000: { name: 'DEAFEN_MEMBERS', logo: 'fa-user-times' },
    0x01000000: { name: 'MOVE_MEMBERS', logo: 'fa-user-ninja' },
    0x02000000: { name: 'USE_VAD', logo: 'fa-shield-alt' },
    0x04000000: { name: 'CHANGE_NICKNAME', logo: 'fa-user-edit' },
    0x08000000: { name: 'MANAGE_NICKNAMES', logo: 'fa-users-cog' },
    0x10000000: { name: 'MANAGE_ROLES', logo: 'fa-user-tag' }
  }

  let numbers = [
    0x00000001,
    0x00000002,
    0x00000004,
    0x00000008,
    0x00000010,
    0x00000020,
    0x00000400,
    0x00000800,
    0x00001000,
    0x00002000,
    0x00004000,
    0x00008000,
    0x00010000,
    0x00020000,
    0x00100000,
    0x00200000,
    0x00400000,
    0x00800000,
    0x01000000,
    0x02000000,
    0x04000000,
    0x08000000,
    0x10000000
  ]
  let result = []
  numbers.map(number => { if ((value & number) > 0) { result.push(operationMapping[number]) } })
  return result
}
