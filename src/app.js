const urlCohort = "../data/cohorts.json"
const urlUser = "../data/cohorts/lim-2018-03-pre-core-pw/users.json"
const urlProgress = "../data/cohorts/lim-2018-03-pre-core-pw/progress.json"
//funcion para obtener datos json
const ServiceApiRequest = (url, callback) => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.onload = callback;
  xhr.send();
}

const getCohorts = () => {
  data1 = JSON.parse(event.target.responseText);
  return data1
}

const getUsers = () => {
  data2 = JSON.parse(event.target.responseText);
  return data2
}
const getProgress = () => {
  let data3 = JSON.parse(event.target.responseText);
  return data3
}

//oteniendo courses
const listCohort = {
  cohorts: [],
  setCohort: (data) => {
    listCohort.cohorts = data
  },
  getNewCohort: () => {
    return listCohort.cohorts
  },
  getCourses: () => {
    let courses = {};
    let getIntro = listCohort.cohorts.map(cohort => {
      if (cohort.id == "lim-2018-03-pre-core-pw") {
        courses = cohort.coursesIndex
      }
    })
    return courses
  }
}

const listUser = {
  users: [],
  setUsers: (data) => {
    listUser.users = data
  },
  getNewUsers: () => {
    return listUser.users
  },
}
const listProgress = {
  progress: [],
  setProgres: (progress) => {
    listProgress.progress = progress;
  },
  getNewProgress: () => {
    return listProgress.progress;
  },
  getIntro: (id, courses) => {
    if (typeof listProgress.progress[id].intro !== "undefined") {
      for (let course in courses) {
        if (listProgress.progress[id][course].lenght !== 0)
          return listProgress.progress[id][course];
      }
    }
    return { percent: 0 }
  }
}
let getPart = (intro) => {
  let list = []
  for (let units in intro) {
    if (units == "units") {
      for (let unit in intro[units]) {
        for (let parts in intro[units][unit]) {
          if (parts == "parts") {
            list.push(intro[units][unit][parts])
          }
        }
      }
    }
  }
  return list
}
const getExersicesById = (id, courses) => {
  let totalExercises = 0
  let completedExercises = 0
  let intro = listProgress.getIntro(id, courses)
  let parts = getPart(intro).map(parts => {
    for (let part in parts) {
      for (let elem in parts[part]) {
        if (elem == "exercises") {
          const exercises = parts[part][elem]
          for (let exercise in exercises) {
            totalExercises++
            if (exercises[exercise].completed === 1) {
              completedExercises++
            }
          }
        }
      }

    }
  })
  const exercises = new Object();
  exercises.total = totalExercises;
  exercises.completed = completedExercises;
  exercises.percent = Math.round(division(completedExercises, totalExercises) * 100)
  return exercises;
}
division = (numerador, denominador) => {
  let total = 0
  if (numerador !== 0 && denominador !== 0) {
    total = numerador / denominador
  }
  return total
},
  getReadsById = (id, courses) => {
    let totalReads = 0;
    let completedReads = 0;
    const intro = listProgress.getIntro(id, courses);
    const parts = getPart(intro).map(parts => {
      for (let part in parts) {
        if (parts[part]["type"] === "read") {
          totalReads++;
          if (parts[part]["completed"] === 1) {
            completedReads++;
          }
        }
      }
    })
    const reads = new Object();
    reads.total = totalReads;
    reads.completed = completedReads;
    reads.percent = Math.round(division(completedReads, totalReads) * 100)
    return reads;
  }
getQuizzesById = (id, courses) => {
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
        }
        if ((parts[part]).hasOwnProperty("score")) {
          scoreSumQuizzes += parts[part].score;
        }
      }
    }
  })
  const quizzes = new Object();
  quizzes.total = totalQuizzes;
  quizzes.completed = completedQuizzes;
  quizzes.percent = Math.round(division(completedQuizzes, totalQuizzes) * 100);
  quizzes.scoreSum = scoreSumQuizzes;
  quizzes.scoreAvg = Math.round(division(scoreSumQuizzes, completedQuizzes));

  return quizzes;
}
