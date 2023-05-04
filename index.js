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

function create(job) {}
