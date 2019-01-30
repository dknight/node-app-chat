const expect = require('expect');
const { Users } = require('./users');

describe('Users', () => {

  let users;

  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: 1,
      name: 'Dima',
      room: 'Node',
      color: '#ff0000'
    },
    {
      id: 2,
      name: 'Julie',
      room: 'Node',
      color: '#ffff00'
    },
    {
      id: 3,
      name: 'Bill',
      room: 'Vue',
      color: '#ffffff'
    }];
  });

  it ('should add new user', () => {
    let users = new Users();
    let user = { id: 123, name: 'Dima', room: 'Office', color: '#000000' };
    users.addUser(user.id, user.name, user.room, user.color);

    expect(users.users).toEqual([user]);
  });

  it('should get user list for room "Node"', () => {
    const usersList = users.getUsersList('Node');
    expect(usersList).toEqual(['Dima', 'Julie']);
  });

  it('should get user list for room "Vue"', () => {
    const usersList = users.getUsersList('Vue');
    expect(usersList).toEqual(['Bill']);
  });

  it('should remove a user', () => {
    const userId = 2;
    const user = users.removeUser(userId);
    expect(user.id).toBe(userId);
    expect(users.users.length).toBe(2);
  });

  it('should not remove a user', () => {
    const userId = 41;
    const user = users.removeUser(userId);
    expect(user).toBeUndefined();
    expect(users.users.length).toBe(3);
  });

  it('should find a user by id', () => {
    const userId = 2;
    const user = users.getUser(userId);
    expect(user.id).toBe(userId);
  });

  it('should not find a user by id', () => {
    const userId = 4;
    const user = users.getUser(userId);
    expect(user).toBeUndefined();
  });
});