let urlCohort = "../data/cohorts.json";
let urlUser = "../data/cohorts/lim-2018-03-pre-core-pw/users.json";
let urlProgress = "../data/cohorts/lim-2018-03-pre-core-pw/progress.json";
let ServiceApiRequest = (url, callback) => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.onload = callback;
  xhr.send();
};
const getCohorts = () => {
  data1 = JSON.parse(event.target.responseText);
  return data1;
};
const getUsers = () => {
  data2 = JSON.parse(event.target.responseText);
  return data2;
};
const getProgress = () => {
  let data3 = JSON.parse(event.target.responseText);
  return data3;
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
  users: {},
  setUsers: (data) => {
    listUser.users = data;
  },
  getNewUsers: () => {
    return listUser.users;
  },
  sort: (OrderBy, OrderDirection, level = 1) => {
    listUser.users.sort(function (a, b) {
      let nombre1 = '';
      let nombre2 = '';
      if (level == 1) {
        let labelOne = a[OrderBy];
        let labelTwo = b[OrderBy];
        nombre1 = labelOne.toLowerCase();
        nombre2 = labelTwo.toLowerCase();
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
      if (OrderDirection == 'asc') {
        if (nombre1 > nombre2) {
          return 1;
        };
        if (nombre1 < nombre2) {
          return -1;
        };
      };
      if (OrderDirection == 'desc') {
        if (nombre1 < nombre2) {
          return 1;
        };
        if (nombre1 > nombre2) {
          return -1;
        };
      };
    });
  },
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
    if (courses !== {}) {
      for (let course in courses) {
        if (typeof listProgress.progress[id][courses[course]] !== "undefined") {
          return listProgress.progress[id][courses[course]];
        };
      };
      return { percent: 0 }
    };
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
    if (parts !== {}) {
      for (let part in parts) {
        if (parts[part] !== {}) {
          for (let elem in parts[part]) {
            if (parts[part][elem] !== {}) {
              if (elem == "exercises") {
                const exercises = parts[part][elem];
                for (let exercise in exercises) {
                  totalExercises++;
                  if (exercises[exercise] !== {}) {
                    if (exercises[exercise].completed === 1) {
                      completedExercises++;
                    };
                  };
                };
              };
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
    if (parts !== {}) {
      for (let part in parts) {
        if (parts[part] !== {}) {
          if (parts[part]["type"] === "read") {
            totalReads++;
            if (parts[part]["completed"] === 1) {
              completedReads++;
            };
          };
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
    if (parts !== {}) {
      for (let part in parts) {
        if (parts[part] !== {}) {
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
