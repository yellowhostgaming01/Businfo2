let resolveConfirmc;
document.ready(function () {
  var a = _("<div>")
    .attr({ id: "customConfirmDialog", class: "custom-confirm-dialog" })
    .append(
      _("<div>")
        .attr("class", "custom-confirm-content")
        .append(_("<h3>").text("Are you sure?"))
        .append(`<p id="customConfirmMessage"></p>`)
        .append(
          `<div class="custom-confirm-buttons"><button id="confirmYes">Yes</button><button id="confirmNo">No</button></div>`
        )
    );

  _("body").append(a);
});

function showConfirmDialogc(message) {
  const dialog = document.getElementById("customConfirmDialog");
  const messageElement = document.getElementById("customConfirmMessage");
  const yesButton = document.getElementById("confirmYes");
  const noButton = document.getElementById("confirmNo");

  // Set the confirmation message
  messageElement.textContent = message;

  // Show the dialog
  dialog.style.display = "flex";

  // Handle button clicks
  yesButton.onclick = () => {
    dialog.style.display = "none";
    if (resolveConfirmc) resolveConfirmc(true);
  };

  noButton.onclick = () => {
    dialog.style.display = "none";
    if (resolveConfirmc) resolveConfirmc(false);
  };
}

function confirm(message) {
  return new Promise((resolve) => {
    resolveConfirmc = resolve;
    showConfirmDialogc(message);
  });
}

// alert
document.ready(function () {
  var a = _("<div>")
    .attr({ class: "customalertbar", id: "customAlert" })
    .append(
      `<span class="closebtn opf" onclick="this.parentElement.style.display='none'">&times;</span> <h2> Yhg Indian WSM </h2> <hr>
    <div class="sms-content">
          <span>Message:</span>
          <p></p>
        </div>`
    )
    .hide();

  _("body").append(a);
});
function alert(sms) {
  var a = _("#customAlert"),
    b = a.find("p");

  yhgquery(document).on("keydown", function (e) {
    if (e.ctrlKey && e.key === "b") {
      a.hide();
    }
  });

  b.html(sms);
  a.show();
}

class Loader {
  constructor() {
    this.loaderElement = null;
  }

  createLoader(logoSrc) {
    // Create a full-screen overlay
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(255, 255, 255, 1)"; // Semi-transparent background
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.zIndex = "9999"; // Make sure it's above everything else

    // Create loader container
    this.loaderElement = document.createElement("div");
    this.loaderElement.className = "loader";

    // Create spinner
    const spinner = document.createElement("div");
    spinner.className = "spinner";
    spinner.style.cssText = `
          width: 100% ;
          height: 100% ;
          border: 8px solid #e0e0e0; /* Light grey background */
          border-top: 8px solid #3498db; /* Blue color for the spinner */
            border-radius: 50%;
            animation: spin linear infinite 1s;
        `;
    this.loaderElement.appendChild(spinner);

    // Create logo
    if (logoSrc) {
      const logo = document.createElement("img");
      logo.src = logoSrc; // Set logo path
      logo.alt = "Logo";
      logo.className = "logo";
      this.loaderElement.appendChild(logo);
      var a = document.createElement("span");
      a.className = "logo bg";
      this.loaderElement.appendChild(a);
    }

    overlay.appendChild(this.loaderElement);
    document.body.appendChild(overlay); // Add overlay to the body
  }

  hideLoader(duration) {
    setTimeout(() => {
      if (this.loaderElement) {
        this.loaderElement.parentElement.remove(); // Remove the overlay
      }
    }, duration * 1000);
  }

  options(config) {
    if (this.loaderElement) {
      // Apply width and height
      if (config.width) {
        this.loaderElement.style.width = config.width;
      }
      if (config.height) {
        this.loaderElement.style.height = config.height;
      }

      // Apply spinner color
      if (config.spinnerColor) {
        const spinner = this.loaderElement.querySelector(".spinner");
        spinner.style.borderTopColor = config.spinnerColor;
      }

      // Apply logo size
      if (config.logoSize) {
        const logo = this.loaderElement.querySelector(".logo");
        logo.style.width = config.logoSize;
      }
    }
  }
}

// pages
// settings
function createSettingsPage(settingsId, settingsTitle, settings) {
  // Create settings page container
  let divsp = document.createElement("div");
  divsp.className = "setting-page";
  divsp.id = settingsId;
  divsp.classList.add("transparent");

  let closeIcon = document.createElement("i");
  var closeIcons = closeIcon.style;
  closeIcons.fontSize = "30px";
  closeIcons.position = "absolute";
  closeIcons.right = "20px";
  closeIcons.top = "5px";
  closeIcon.className = "opf opf-clear";
  // closeIcon.innerHTML = '&#215;'
  closeIcon.onclick = function () {
    divsp.style.display = "none";
  };
  divsp.appendChild(closeIcon);
  // Create heading for the settings
  let center = document.createElement("center");
  let heading = document.createElement("h1");
  heading.textContent = settingsTitle;
  heading.style.color = "unset";
  center.appendChild(heading);
  divsp.appendChild(center);

  // Create and append settings to the div
  settings.forEach((setting) => {
    let settingGroup = document.createElement("div");
    settingGroup.classList.add("setting-group");

    // Create label
    let label = document.createElement("label");
    label.setAttribute("for", setting.id);
    label.textContent = setting.label;
    settingGroup.appendChild(label);

    // Create input element
    let input;

    switch (setting.type) {
      case "select":
        input = document.createElement("select");
        setting.options.forEach(function (e) {
          let option = document.createElement("option");
          option.textContent = e.label;
          option.value = e.value;
          input.appendChild(option);
        });
        break;

      default:
        input = document.createElement("input");
    }
    Object.keys(setting).forEach(function (e) {
      input.setAttribute(e, setting[e]);
    });
    settingGroup.appendChild(input);
    divsp.appendChild(settingGroup);


    if (setting.type2) {
      switch (setting.type2) {
        case 'color':
          let colorELt = document.createElement('i')
          colorELt.className = "fa fa-palette sgC"
          settingGroup.appendChild(colorELt)
          break;
      
        default:
          break;
      }
    }

  });
  // Create save button
  let saveButton = document.createElement("button");
  saveButton.id = "save-settings";
  saveButton.textContent = "Save Settings";
  divsp.appendChild(saveButton);

 

  // Append the settings div to the body or an appropriate container
  document.body.appendChild(divsp);
}

// dropdown select tag
// Create Custom Dropdown
function createCustomDropdown(dropdown) {
  // Get All Select Options
  // And Convert them from NodeList to Array
  const options = dropdown.querySelectorAll("option");
  const optionsArr = Array.prototype.slice.call(options);
  let id = dropdown.getAttribute("data-id");

  // Create Custom Dropdown Element and Add Class Dropdown
  const customDropdown = document.createElement("div");
  customDropdown.classList.add("dropdown");
  dropdown.insertAdjacentElement("afterend", customDropdown);

  // Create Element for Selected Option
  const selected = document.createElement("div");
  selected.classList.add("dropdown-select");
  selected.id = id;
   selected.textContent = optionsArr[0].textContent;
  customDropdown.appendChild(selected);

  // Create Element for Dropdown Menu
  // Add Class and Append it to Custom Dropdown
  const menu = document.createElement("div");
  menu.classList.add("dropdown-menu");
  customDropdown.appendChild(menu);
  selected.addEventListener("click", toggleDropdown.bind(menu));

  // Create Search Input Element
  const search = document.createElement("input");
  search.placeholder = "Search...";
  search.type = "text";
  search.classList.add("dropdown-menu-search");
  menu.appendChild(search);

  // Create Wrapper Element for Menu Items
  // Add Class and Append to Menu Element
  const menuInnerWrapper = document.createElement("div");
  menuInnerWrapper.classList.add("dropdown-menu-inner");
  menu.appendChild(menuInnerWrapper);

  // Loop All Options and Create Custom Option for Each Option
  // And Append it to Inner Wrapper Element
  optionsArr.forEach((option) => {
    const item = document.createElement("div");
    item.classList.add("dropdown-menu-item");
    item.dataset.value = option.value;
    item.textContent = option.textContent;
    menuInnerWrapper.appendChild(item);

    item.addEventListener(
      "click",
      setSelected.bind(item, selected, dropdown, menu)
    );
  });

  // Add Selected Class to First Custom Select Option
  menuInnerWrapper.querySelector("div").classList.add("selected");

  // Add Input Event to Search Input Element to Filter Items
  // Add Click Event to Element to Close Custom Dropdown if Clicked Outside
  // Hide the Original Dropdown(Select)
  search.addEventListener("input", filterItems.bind(search, optionsArr, menu));
  document.addEventListener(
    "click",
    closeIfClickedOutside.bind(customDropdown, menu)
  );
  dropdown.style.display = "none";
}

// Toggle for Display and Hide Dropdown
function toggleDropdown() {
  if (this.offsetParent !== null) {
    this.style.display = "none";
  } else {
    this.style.display = "block";
    this.querySelector("input").focus();
  }
}

// Set Selected Option
function setSelected(selected, dropdown, menu) {
  // Get Value and Label from Clicked Custom Option
  const value = this.dataset.value;
  const label = this.textContent;

  // Change the Text on Selected Element
  // Change the Value on Select Field
  selected.textContent = label;
  dropdown.value = value;

  // Close the Menu
  // Reset Search Input Value
  // Remove Selected Class from Previously Selected Option
  // And Show All Div if they Were Filtered
  // Add Selected Class to Clicked Option
  menu.style.display = "none";
  menu.querySelector("input").value = "";
  menu.querySelectorAll("div").forEach((div) => {
    if (div.classList.contains("is-select")) {
      div.classList.remove("is-select");
    }
    if (div.offsetParent === null) {
      div.style.display = "block";
    }
  });
  this.classList.add("is-select");
}

// Filter the Items
function filterItems(itemsArr, menu) {
  // Get All Custom Select Options
  // Get Value of Search Input
  // Get Filtered Items
  // Get the Indexes of Filtered Items
  const customOptions = menu.querySelectorAll(".dropdown-menu-inner div");
  const value = this.value.toLowerCase();
  const filteredItems = itemsArr.filter((item) =>
    item.value.toLowerCase().includes(value)
  );
  const indexesArr = filteredItems.map((item) => itemsArr.indexOf(item));

  // Check if Option is not Inside Indexes Array
  // And Hide it and if it is Inside Indexes Array and it is Hidden Show it
  itemsArr.forEach((option) => {
    if (!indexesArr.includes(itemsArr.indexOf(option))) {
      customOptions[itemsArr.indexOf(option)].style.display = "none";
    } else {
      if (customOptions[itemsArr.indexOf(option)].offsetParent === null) {
        customOptions[itemsArr.indexOf(option)].style.display = "block";
      }
    }
  });
}

// Close Dropdown if Clicked Outside Dropdown Element
function closeIfClickedOutside(menu, e) {
  if (
    e.target.closest(".dropdown") === null &&
    e.target !== this &&
    menu.offsetParent !== null
  ) {
    menu.style.display = "none";
  }
}

function makeTbody(...name){

}