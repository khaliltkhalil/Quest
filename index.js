fetchJobs();

function fetchJobs() {
  fetch("http://localhost:3000/jobs")
    .then((res) => res.json())
    .then((jobs) => {
      jobs.forEach((job) => {
        renderJob(job);
      });
    });
}

const form = document.querySelector("#add-job-form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const newJob = {
    title: e.target.title.value,
    company: e.target.company.value,
    location: e.target.location.value,
    status: e.target.status.value,
  };
  fetch("http://localhost:3000/jobs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(newJob),
  })
    .then((res) => res.json())
    .then((addedJob) => {
      renderJob(addedJob);
      e.target.title.value = "";
      e.target.company.value = "";
      e.target.location.value = "";
      e.target.status.value = "applied";
    });
});

function renderJob(job) {
  // select the container that matches the job status
  const jobsContainer = document.querySelector(`#${job.status}`);

  const jobComponent = document.createElement("div");
  jobComponent.setAttribute("id", `${job.id}`);

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
  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.addEventListener("click", () => {
    document.querySelector("#modal").style.display = "block";
    document.body.style.overflow = "hidden";

    document.querySelector("#job-id").textContent = `${job.id}`;

    const editForm = document.querySelector("#edit-form");
    editForm.editTitle.value = job.title;
    editForm.editCompany.value = job.company;
    editForm.editLocation.value = job.location;
    editForm.editStatus.value = job.status;
  });

  jobComponent.appendChild(editButton);
  jobsContainer.appendChild(jobComponent);
}

const closeModalBtn = document.querySelector(".close-btn");
closeModalBtn.addEventListener("click", () => {
  document.querySelector("#modal").style.display = "none";
  document.body.style.overflow = "auto";
});

const editForm = document.querySelector("#edit-form");
editForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const jobId = document.querySelector("#job-id").textContent;
  const editedJob = {
    title: e.target.editTitle.value,
    company: e.target.editCompany.value,
    location: e.target.editLocation.value,
    status: e.target.editStatus.value,
  };
  fetch(`http://localhost:3000/jobs/${jobId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(editedJob),
  })
    .then((res) => res.json())
    .then((job) => {});
});
