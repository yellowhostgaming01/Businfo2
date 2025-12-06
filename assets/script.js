function openSection(id) {
  // hide grid
  document.querySelector(".card-grid").style.display = "none";
  // show selected section
  document.getElementById(id).style.display = "block";
}

function openSectionTop(id, old) {
  const newSection = document.getElementById(id);
  if (!newSection) return;

  let baseZ = 999; // default agar old nahi mila
  if (old) {
    // old element ka current z-index le lo
    const oldZ = parseInt(window.getComputedStyle(old).zIndex, 10);
    baseZ = isNaN(oldZ) ? 999 : oldZ;
  }

  // Set new section z-index +1
  newSection.style.zIndex = baseZ + 1;
  newSection.style.display = "block";
}

function closeSectionTop(id) {
  const sec = document.getElementById(id);
  if (!sec) return;

  // Hide section
  sec.style.display = "none";
}

function closeSection(id) {
  // show grid
  document.querySelector(".card-grid").style.display = "grid";
  // hide section
  document.getElementById(id).style.display = "none";
}

var places1 = ["Delhi", "Mumbai", "Kolkata", "Chennai", "Bangalore"];
function swapInputs(fromInputId, toInputId) {
  const fromInput = document.getElementById(fromInputId);
  const toInput = document.getElementById(toInputId);
  // Swap values
  const temp = fromInput.value;
  fromInput.value = toInput.value;
  toInput.value = temp;
}

const swapIcon = document.querySelector(".app-swap-icon");
swapIcon.addEventListener("click", () => swapInputs("fromInput", "toInput"));

document.querySelectorAll(".suggestion-input").forEach((input) => {
  input.addEventListener("input", () => {
    showSuggestions(input);
  });
});

function showSuggestions(input) {
  const listName = input.dataset.list; // get which list to use
  const listData = window[listName]; // dynamic list
  const val = input.value.toLowerCase();
  const ul = input.nextElementSibling; // get ul.suggestions
  ul.innerHTML = "";

  // set dropdown width same as input
  ul.style.width = input.offsetWidth + "px";

  if (!val) {
    ul.style.display = "none";
    return;
  }

  const filtered = listData.filter((p) => p.toLowerCase().includes(val));
  filtered.forEach((p) => {
    const li = document.createElement("li");
    li.textContent = p;
    li.onclick = () => {
      input.value = p;
      ul.style.display = "none";
    };
    ul.appendChild(li);
  });

  ul.style.display = filtered.length ? "block" : "none";
}

// Helper to show error
function validateFromTo() {
  const fromInput = document.getElementById("fromInput");
  const toInput = document.getElementById("toInput");

  const from = fromInput.value.trim().toLowerCase();
  const to = toInput.value.trim().toLowerCase();

  // Error element create or reuse
  let err = document.querySelector("#searchSection_error");
  if (!err) {
    err = document.createElement("div");
    err.id = "searchSection_error";
    err.className = "inputErrorUnique_searchSection";
    fromInput.parentElement.parentElement.appendChild(err);
  }

  // --- Helper Functions inside main function ---
  const showError = (message) => {
    err.textContent = message;
    err.style.display = "block";
    fromInput.classList.add("errorInputUnique_searchSection");
    toInput.classList.add("errorInputUnique_searchSection");
  };

  const clearError = () => {
    err.style.display = "none";
    fromInput.classList.remove("errorInputUnique_searchSection");
    toInput.classList.remove("errorInputUnique_searchSection");
  };
  // ------------------------------------------------

  // 1. Empty check
  if (!from || !to) {
    showError("From and To fields cannot be empty!");
    return false;
  }

  // 2. Same city check
  if (from === to) {
    showError("From and To cannot be the same!");
    return false;
  }

  // 3. All good
  clearError();
  return true;
}

// click outside closes any dropdown
document.addEventListener("click", (e) => {
  if (!e.target.classList.contains("suggestion-input")) {
    document
      .querySelectorAll(".suggestions")
      .forEach((ul) => (ul.style.display = "none"));
  }
});

const searchBtn = document.querySelector(".app-search-btn");

searchBtn.addEventListener("click", () => {
  if (!validateFromTo()) return;

  // Disable button
  searchBtn.disabled = true;

  // Remove text/icon
  searchBtn.innerHTML = "";

  // Add spinner
  const spinner = document.createElement("div");
  spinner.classList.add("spinner");
  searchBtn.appendChild(spinner);

  const fromInput = document.getElementById("fromInput");
  const toInput = document.getElementById("toInput");
  const from = fromInput.value.trim().toUpperCase();
  const to = toInput.value.trim().toUpperCase();

  findBusesByCities(from, to, searchBtn.parentElement);
  searchBtn.disabled = false; // enable button
  searchBtn.innerHTML = '<i class="fas fa-search"></i> Search';
});

// load realtime cities
function fetchCitiesRealtime() {
  const cityCol = collection(db, "CityInfo");

  onSnapshot(cityCol, (snapshot) => {
    const cities = snapshot.docs.map((doc) => ({
      name: doc.data().CityName || "",
      code: doc.data().CityCode || "",
    }));

    // Suggestion system me use hone wala list
    window.places1 = cities.map((c) => c.name);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  fetchCitiesRealtime();
});

async function fetchBusesAdvanced(searchFrom, searchTo) {
  const busCol = collection(db, "BusInfo");
  const busSnapshot = await getDocs(busCol);

  const buses = busSnapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter((bus) => {
      const fromMatch = searchFrom
        ? bus.From.toLowerCase() === searchFrom.toLowerCase() ||
          bus.Stops.some(
            (s) => s.Station.toLowerCase() === searchFrom.toLowerCase()
          )
        : true;

      const toMatch = searchTo
        ? bus.To.toLowerCase() === searchTo.toLowerCase() ||
          bus.Stops.some(
            (s) => s.Station.toLowerCase() === searchTo.toLowerCase()
          )
        : true;

      return fromMatch && toMatch;
    });

  return buses;
}

function to12Hour(time24) {
  if (!time24) return "";
  console.log(time24);

  let [hour, minute] = time24.split(":").map(Number);

  let ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  if (hour === 0) hour = 12;

  return `${hour}:${minute.toString().padStart(2, "0")} ${ampm}`;
}

function getJourneyTimes(bus) {
  let stops = bus.Stops;
  if (!stops || stops.length === 0) return {};

  // From/To search
  let fromIndex = stops.findIndex((s) => s.Station === bus.From);
  let toIndex = stops.findIndex((s) => s.Station === bus.To);

  // Agar kisi wajah se stops me direct match na mile
  // fallback: 0 se last
  if (fromIndex === -1) fromIndex = 0;
  if (toIndex === -1) toIndex = stops.length - 1;

  let startStop = stops[fromIndex];
  let endStop = stops[toIndex];

  let startTime = startStop.Departure || startStop.Arrival;
  let endTime = endStop.Arrival || endStop.Departure;

  return {
    startTime,
    endTime,
    duration: calculateDuration(startTime, endTime),
    start12: to12Hour(startTime),
    end12: to12Hour(endTime),
  };
}
function calculateDuration(start, end) {
  let [sh, sm] = start.split(":").map(Number);
  let [eh, em] = end.split(":").map(Number);

  let startMin = sh * 60 + sm;
  let endMin = eh * 60 + em;

  if (endMin < startMin) endMin += 24 * 60;

  let diff = endMin - startMin;
  let h = Math.floor(diff / 60);
  let m = diff % 60;
  return `${h}h ${m.toString().padStart(2, "0")}m`;
}

var findBusesByCities = async function (from, to, parentDiv) {
  const titleEl = document.querySelector(
    "#searchedCitySection .app-section-title"
  );

  if (titleEl) {
    const routeTitle = `${from} → ${to}`;
    titleEl.textContent = routeTitle;
  }

  const busList = await fetchBusesAdvanced(from, to);
  const container = document.querySelector(
    "#searchedCitySection .searched-content"
  );
  container.innerHTML = ""; // purana hata de

  busList.forEach((bus) => {
    const firstStop = bus.Stops[0] || {};
    const lastStop = bus.Stops[bus.Stops.length - 1] || {};

    const card = document.createElement("div");
    card.className = "bus-item";

    let t = getJourneyTimes(bus);
    card.innerHTML = `
        <div class="bus-time-row">
            <div class="time">${t.start12 || ""} - ${t.end12 || ""}</div>
            <div class="bus-type">${bus.BusType || ""}</div>
        </div>
        <div class="bus-info-row">
            <span>⏰ ${t.duration}</span>
            <span><i class="fas fa-building"></i> ${bus.Vendor}</span>
        </div>
        <div class="bus-extra">Route-${bus.Route || ""}</div>
        `;

    card.addEventListener("click", function(){
      
    })
    container.appendChild(card);
  });

  openSectionTop("searchedCitySection", parentDiv);
};
