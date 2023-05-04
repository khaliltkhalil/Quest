function fetchJobs() {
  fetch("http://localhost:3000/jobs")
    .then((res) => res.json())
    .then((jobs) => {
      jobs.forEach((job) => {
        renderJob(job);
      });
    });
}

fetchJobs();

const form = document.querySelector("#add-job-form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const newJob = {
    title: e.target.title.value,
    company: e.target.company.value,
    location: e.target.location.value,
    status: e.target.status.value,
  };
  console.log(newJob);
});

function renderJob(job) {
  // select the container that matches the job status
  const jobsContainer = document.querySelector(`#${job.status}`);
  const jobComponent = document.createElement("div");
  const title = document.createElement("h3");
  title.textContent = job.title;
  jobComponent.appendChild(title);

  const company = document.createElement("h4");
  company.textContent = job.company;
  jobComponent.appendChild(company);

  const location = document.createElement("p");
  location.textContent = job.location;
  jobComponent.appendChild(location);
  jobComponent.className = "job-component";
  jobsContainer.appendChild(jobComponent);
}
