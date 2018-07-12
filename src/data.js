window.computeUsersStats = (users, progress, courses) => {
  listProgress.setProgres(progress);
  const allUsers = users.map(usersWithStats => {
    if (usersWithStats !== {}) {
      usersWithStats.stats = {
        percent: listProgress.getIntro(usersWithStats.id, courses).percent,
        exercises: getExersicesById(usersWithStats.id, courses),
        reads: getReadsById(usersWithStats.id, courses),
        quizzes: getQuizzesById(usersWithStats.id, courses),
      };
      return usersWithStats;
    };
  });
  return allUsers;
};
window.sortUsers = (users, orderBy, orderDireccion) => {
  listUser.setUsers(users);
  if (orderBy == 'stats.percent') {
    let res = orderBy.split(".");
    return  sortFunction(res[1], orderDireccion, 2);
  } else if (
    orderBy == 'stats.exercises.percent') {
    let res = orderBy.split(".");
    return  sortFunction(res[2], orderDireccion, 3);
  } else if (
    orderBy == 'stats.reads.percent') {
    let res = orderBy.split(".");
    return sortFunction(res[2], orderDireccion, 4);
  } else if (
    orderBy == 'stats.quizzes.percent') {
    let res = orderBy.split(".");
    return sortFunction(res[2], orderDireccion, 5);
  } else if (
    orderBy == 'stats.quizzes.scoreAvg') {
    let res = orderBy.split(".");
    return sortFunction(res[2], orderDireccion, 5);
  } else{
   return sortFunction(orderBy, orderDireccion,1);
  };
  return listUser.getNewUsers();
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
  const courses = Object.keys (options.cohort.coursesIndex);
  let newStudents = computeUsersStats(options.cohortData.users,options.cohortData.progress,courses);
  newStudents = sortUsers(newStudents,options.orderBy, options.orderDirection);
  if (options.search !== '') {
    newStudents = filterUsers(newStudents, options.search);
   };
  return newStudents;
};
window.listCohort = {
  cohorts: {},
  setCohort: (data) => {
    listCohort.cohorts = data;
  },
  getByid: (id) => {

  },
  getNewCohort: () => {
    return listCohort.cohorts;
  },
  getCourses: () => {
    let courses = {};
    let getIntro = listCohort.cohorts.map(cohort => {
      if (cohort.id == "lim-2018-03-pre-core-pw") {
        courses = Object.keys(cohort.coursesIndex);
      };
    });
    return courses;
  },
};
window.listUser = {
  users: [],
  setUsers: (data) => {
    listUser.users = data;
  },
  getNewUsers: () => {
    return listUser.users;
  },
};
window.sortFunction = (OrderBy, OrderDirection, level = 1) => {
  let order = listUser.getNewUsers().sort((a, b) => {
    let nombre1 = '';
    let nombre2 = '';
    if (level == 1) {
      let labelOne = a[OrderBy];
      let labelTwo = b[OrderBy];
      if(OrderBy=='name'){
        nombre1 = labelOne.toLowerCase();
        nombre2 = labelTwo.toLowerCase();
      }else {
        nombre1 = labelOne;
        nombre2 = labelTwo;
      }
    };
    if (level == 2) {
      nombre1 = a.stats[OrderBy];
      nombre2 = b.stats[OrderBy];
    };
    if (level == 3) {
      nombre1 = a.stats.exercises;
      if (a["stats"]["exercises"]) {
        nombre1 = a["stats"]["exercises"][OrderBy];
      };
      if (b["stats"]["exercises"]) {
        nombre2 = b['stats']['exercises'][OrderBy];
      };
    };
    if (level == 4) {
      nombre1 = a.stats.reads[OrderBy];
      nombre2 = b.stats.reads[OrderBy];
    };
    if (level == 5) {
      nombre1 = a.stats.quizzes[OrderBy];
      nombre2 = b.stats.quizzes[OrderBy];
    };
    if (OrderDirection == 'asc' || OrderDirection == 'ASC' ) {
      if (nombre1 > nombre2) {
        return 1;
      };
      if (nombre1 < nombre2) {
        return -1;
      };
    };
    if (OrderDirection == 'desc' || OrderDirection === 'DESC') {
      if (nombre1 < nombre2) {
        return 1;
      };
      if (nombre1 > nombre2) {
        return -1;
      };
    };
  });
  
  return order
};
window.listProgress = {
  progress: [],
  setProgres: (progress) => {
    listProgress.progress = progress;
  },
  getNewProgress: () => {
    return listProgress.progress;
  },
  getIntro: (id, courses) => {
    for (let course in courses) {
      if (typeof listProgress.progress[id][courses[course]] !== "undefined") {
        return listProgress.progress[id][courses[course]];
      };
    };
    return { percent: 0 }
  },
};
let getPart = (intro) => {
  let list = [];
  for (let units in intro) {
    if (units == "units") {
      for (let unit in intro[units]) {
        for (let parts in intro[units][unit]) {
          if (parts == "parts") {
            list.push(intro[units][unit][parts]);
          };
        };
      };
    };
  };
  return list;
};
window.getExersicesById = (id, courses) => {
  let totalExercises = 0;
  let completedExercises = 0;
  let intro = listProgress.getIntro(id, courses);
  let parts = getPart(intro).map(parts => {
    for (let part in parts) {
      for (let elem in parts[part]) {
        if (elem == "exercises") {
          const exercises = parts[part][elem];
          for (let exercise in exercises) {
            totalExercises++;
            if (exercises[exercise].completed === 1) {
              completedExercises++;
            };
          };
        };
      };
    };
  });
  const exercises = new Object();
  exercises.total = totalExercises;
  exercises.completed = completedExercises;
  exercises.percent = Math.round(division(completedExercises, totalExercises) * 100);
  return exercises;
};
let division = (numerador, denominador) => {
  let total = 0;
  if (numerador !== 0 && denominador !== 0) {
    total = numerador / denominador;
  };
  return total;
};
window.getReadsById = (id, courses) => {
  let totalReads = 0;
  let completedReads = 0;
  const intro = listProgress.getIntro(id, courses);
  const parts = getPart(intro).map(parts => {
    for (let part in parts) {
      if (parts[part]["type"] === "read") {
        totalReads++;
        if (parts[part]["completed"] === 1) {
          completedReads++;
        };
      };
    };
  });
  const reads = new Object();
  reads.total = totalReads;
  reads.completed = completedReads;
  reads.percent = Math.round(division(completedReads, totalReads) * 100);
  return reads;
};
window.getQuizzesById = (id, courses) => {
  let totalQuizzes = 0;
  let completedQuizzes = 0;
  let scoreSumQuizzes = 0;
  const intro = listProgress.getIntro(id, courses);
  const parts = getPart(intro).map(parts => {
    for (let part in parts) {
      if (parts[part]["type"] === "quiz") {
        totalQuizzes++;
        if (parts[part]["completed"] === 1) {
          completedQuizzes++;
        };
        if ((parts[part]).hasOwnProperty("score")) {
          scoreSumQuizzes += parts[part].score;
        };
      };
    };
  });
  const quizzes = new Object();
  quizzes.total = totalQuizzes;
  quizzes.completed = completedQuizzes;
  quizzes.percent = Math.round(division(completedQuizzes, totalQuizzes) * 100);
  quizzes.scoreSum = scoreSumQuizzes;
  quizzes.scoreAvg = Math.round(division(scoreSumQuizzes, completedQuizzes));
  return quizzes;
};
window.findUsers = (listusers, id) => {
  let list = listusers.find((user) => {
    return user.id == id;
  });
  if (list.stats !== {}) {
    if (list.stats !== "undefined") {
      return list.stats;
    };
  };
  return {};
};
