/*
  Edit this file to control admin login.

  permissions:
  - players: add, remove, and edit players
  - modes: add, remove, and edit game modes
  - save: save changes into players-data.js
*/

window.TIERLANDS_ADMIN_USERS = [
  {
    username: "byhju",
    password: "mohamedlovebred ",
    permissions: {
      players: true,
      modes: true,
      save: true
    }
  },
  {
    username: "viewer",
    password: "viewer",
    permissions: {
      players: false,
      modes: false,
      save: false
    }
  }
];
