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
  const data = new FormData(e.target);
  const newJob = Object.fromEntries(data.entries());
  if (!Object.values(newJob).every(Boolean)) {
    showAlert();
    return;
  }

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
  jobComponent.setAttribute("id", `job-${job.id}`);

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
  jobComponent.setAttribute("draggable", true);

  jobComponent.addEventListener("dragstart", dragStart);
  jobComponent.addEventListener("dragend", dragEnd);

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.className = "btn edit-btn";
  editButton.addEventListener("click", () => {
    openMoodal();

    document.querySelector("#job-id").textContent = `${job.id}`;
    // get the job component
    const jobComponent = document.querySelector(`#job-${job.id}`);
    const currentContainer = jobComponent.parentNode;
    const status = currentContainer.getAttribute("id");
    const editForm = document.querySelector("#edit-form");
    editForm.editTitle.value = jobComponent.querySelector("h3").textContent;
    editForm.editCompany.value = jobComponent.querySelector("h4").textContent;
    editForm.editLocation.value = jobComponent.querySelector("p").textContent;
    editForm.editStatus.value = status;
  });

  jobComponent.appendChild(editButton);
  jobsContainer.appendChild(jobComponent);
}

function dragStart(e) {
  e.dataTransfer.setData("text/plain", e.target.id);
  e.target.classList.add("transparent");
}

function dragEnd(e) {
  e.target.classList.remove("transparent");
}

// add drag events to all jobs containers
const jobsContainers = document.querySelectorAll(".jobs-container");

jobsContainers.forEach((jobsContainer) => {
  jobsContainer.addEventListener("dragenter", dragEnter);
  jobsContainer.addEventListener("dragover", dragOver);
  jobsContainer.addEventListener("dragleave", dragLeave);
  jobsContainer.addEventListener("drop", drop);
});

function dragEnter(e) {
  // make sure the dropzone is not another job component

  if (e.target.className === "jobs-container") {
    e.preventDefault();
    e.target.parentNode.classList.add("drag-over");
  }
}
function dragOver(e) {
  if (e.target.className === "jobs-container") {
    e.preventDefault();
    e.target.parentNode.classList.add("drag-over");
  }
}
function dragLeave(e) {
  e.target.parentNode.classList.remove("drag-over");
}
function drop(e) {
  e.target.parentNode.classList.remove("drag-over");
  // get the draggable element
  const id = e.dataTransfer.getData("text/plain");
  const jobId = id.substring(4);
  const newStatus = e.target.getAttribute("id");
  const draggable = document.getElementById(id);
  e.target.appendChild(draggable);
  fetch(`http://localhost:3000/jobs/${jobId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ status: newStatus }),
  }).then((res) => res.json());
}

const closeModalBtn = document.querySelector(".close-btn");
closeModalBtn.addEventListener("click", closeModal);

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
    .then((job) => {
      editJobComponent(job);
    });
});

function editJobComponent(job) {
  const jobComponent = document.querySelector(`#job-${job.id}`);
  const currentContainer = jobComponent.parentNode;
  const currentStatus = currentContainer.getAttribute("id");
  jobComponent.querySelector("h3").textContent = job.title;
  jobComponent.querySelector("h4").textContent = job.company;
  jobComponent.querySelector("p").textContent = job.location;
  // move job component to the new container if status is changed
  if (job.status !== currentStatus) {
    const newContainer = document.querySelector(`#${job.status}`);
    newContainer.appendChild(jobComponent);
  }

  closeModal();
}

function openMoodal() {
  document.querySelector("#modal").style.display = "block";
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.querySelector("#modal").style.display = "none";
  document.body.style.overflow = "auto";
}

function showAlert() {
  const alert = document.getElementById("alert");
  alert.classList.remove("hidden");
  setTimeout(() => {
    alert.classList.add("hidden");
  }, 3000);
}
