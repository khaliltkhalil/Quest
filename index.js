function fetchJobs() {
  fetch("http://localhost:3000/jobs")
    .then((res) => res.json())
    .then((jobs) => {
      console.log(jobs);
    });
}
fetchJobs();
