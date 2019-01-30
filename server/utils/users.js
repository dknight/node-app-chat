class Users {
  
  constructor() {
    this.users = [];
  }

  addUser(id, name, room, color) {
    let user = { id, name, room, color };
    this.users.push(user);
    return user;
  }

  removeUser(id) {
    const user = this.getUser(id);
    if (user) {
      this.users = this.users.filter(u => u.id !== id);
    }

    return user;
  }

  getUser(id) {
    return this.users.find(u => u.id === id);
  }

  getUsersList(room) {
    const users = this.users.filter(u => u.room === room);
    const namesArray = users.map(u => u.name);

    return namesArray;
  }
}

module.exports = { Users };