window.computeUsersStats = (users, progress, courses) => {
  const allUsers = users.map(usersWithStats => {
    usersWithStats.stats = {
      percent: listProgress.getIntro(usersWithStats.id, courses).percent,
      exercises: getExersicesById(usersWithStats.id, courses),
      reads: getReadsById(usersWithStats.id, courses),
      quizzes: getQuizzesById(usersWithStats.id, courses),
    }
    return usersWithStats;
  });
  return allUsers;
};
window.sortUsers = (users, orderBy, orderDireccion) => {
  listUser.setUsers(users);
  if (orderBy == 'stats.percent') {
    var res = orderBy.split(".");
    listUser.sort(res[1], orderDireccion, 2);
  } else if (orderBy == 'stats.exercises.total' ||
    orderBy == 'stats.exercises.completed' ||
    orderBy == 'stats.exercises.percent') {
    var res = orderBy.split(".");
    listUser.sort(res[2], orderDireccion, 3);
  } else if (orderBy == 'stats.reads.total' ||
    orderBy == 'stats.reads.completed' ||
    orderBy == 'stats.reads.percent') {
    var res = orderBy.split(".");
    listUser.sort(res[2], orderDireccion, 4);
  } else if (orderBy == 'stats.quizzes.total' ||
    orderBy == 'stats.quizzes.completed' ||
    orderBy == 'stats.quizzes.percent') {
    var res = orderBy.split(".");
    listUser.sort(res[2], orderDireccion, 5);
  } else {
    listUser.sort(orderBy, orderDireccion);
  };
};
window.filterUsers = (users, search) => {
  let list = users.filter((user) => {
    let nombre = user.name.toUpperCase();
    nombre = nombre.indexOf(search.toUpperCase()) + 1;
    return nombre;
  });
  return list;
};
window.findUsers = (listusers, id) => {
  let list = listusers.find((user) => {
    return user.id == id;
  });
  if (list.stats!=="undefined"){
    return list.stats;
  };
  return {};
};
window.processCohortData = (options) => {
  return {};
};