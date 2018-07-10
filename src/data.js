window.computeUsersStats = (users, progress, courses) => {
  listProgress.setProgres(progress);
  const allUsers = users.map(usersWithStats => {
    if (usersWithStats !== {}) {
      usersWithStats.stats = {
        percent: listProgress.getIntro(usersWithStats.id, courses).percent,
        exercises: getExersicesById(usersWithStats.id, courses),
        reads: getReadsById(usersWithStats.id, courses),
        quizzes: getQuizzesById(usersWithStats.id, courses),
      }
      return usersWithStats;
    }
  });
  return allUsers;
};
window.sortUsers = (users, orderBy, orderDireccion) => {
  listUser.setUsers(users);

  if (orderBy == 'stats.percent') {
    let res = orderBy.split(".");
    sortFunction(res[1], orderDireccion, 2);
  } else if (
    orderBy == 'stats.exercises.percent') {
    let res = orderBy.split(".");
    sortFunction(res[2], orderDireccion, 3);
  } else if (
    orderBy == 'stats.reads.percent') {
    let res = orderBy.split(".");
    sortFunction(res[2], orderDireccion, 4);
  } else if (
    orderBy == 'stats.quizzes.percent') {
    let res = orderBy.split(".");
    sortFunction(res[2], orderDireccion, 5);
  } else {
    sortFunction(orderBy, orderDireccion);
  };
  console.log(listUser.getNewUsers()[0])
  return listUser.getNewUsers()
};
window.filterUsers = (users, search) => {
  let list = users.filter((user) => {
    let nombre = user.name.toUpperCase();
    nombre = nombre.indexOf(search.toUpperCase()) + 1;
    return nombre;
  });
  return list;
};

window.processCohortData = (options) => {
  // let courses = listCohort.getCourses()
  // let userStudents = computeUsersStats(options.cohortData.users,options.cohortData.progress,courses);
  // userStudents = sortUsers(userStudents,options.orderBy, options.orderDirection);
  // if (options.search !== '') {
  //   students = filterUsers(students, options.search);
  // }
  return {};
};