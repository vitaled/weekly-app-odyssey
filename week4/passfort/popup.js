// Function to search for a website
async function search() {
  // Get the search query
  const query = document.getElementById("search").value;

  // Retrieve all data from chrome.storage
  chrome.storage.sync.get(null, async function (items) {
    // Filter the items based on the search query
    const results = Object.keys(items)
      .filter((key) => key.includes(query))
      .map((key) => items[key]);

    // Decrypt the results
    console.log(results);
    const decryptedResults = await Promise.all(results.map(decryptData));

    // Display the results
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = ""; // clear the div

    // Create a table
    const table = document.createElement("table");

    // Create table header
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    ["Website", "Username", "Password", ""].forEach((header) => {
      const th = document.createElement("th");
      th.textContent = header;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement("tbody");

    decryptedResults.forEach((result) => {
      const row = document.createElement("tr");

      // Website
      const websiteCell = document.createElement("td");
      websiteCell.textContent = result.website;
      row.appendChild(websiteCell);

      // Username
      const usernameCell = document.createElement("td");
      usernameCell.textContent = result.username;
      row.appendChild(usernameCell);

      // Password
      const passwordCell = document.createElement("td");
      const maskedPassword = "*".repeat(result.password.length);
      passwordCell.textContent = maskedPassword;
      row.appendChild(passwordCell);

      // Delete button
      const deleteCell = document.createElement("td");
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.className = 'delete-button';
      deleteButton.setAttribute('data-url', result.website);
      deleteButton.addEventListener('click', function(event) {
        var url = event.target.getAttribute('data-url');
        deleteCredential(url);
        search();
      });
      deleteCell.appendChild(deleteButton);
      row.appendChild(deleteCell);

      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    resultsDiv.appendChild(table);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  // Query for the active tab in the current window
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    // tabs is an array, but there will only be one tab in it
    var tab = tabs[0];
    var url = new URL(tab.url);
    var hostname = url.hostname;

    // Find the URL input field
    var urlInput = document.getElementById("website");

    // Set the value of the URL input field to the hostname
    urlInput.value = hostname;
  });
  // Function to handle the add form submission
  document
    .getElementById("addForm")
    .addEventListener("submit", async function (event) {
      // Prevent the form from being submitted
      event.preventDefault();

      // Get the form data
      const website = document.getElementById("website").value;
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      console.log(
        "Website: " + website,
        "Username: " + username,
        "Password: " + password
      );
      //Encrypt the data
      const encryptedData = await encryptData({
        website,
        username,
        password,
      });

      // Store the encrypted data in chrome.storage
      chrome.storage.sync.set({ [website]: encryptedData }, function () {
        console.log("User data for " + website + " has been stored.");
      });
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icons/icon48.png", // Replace with your icon
        title: "Success",
        message: "Credentials added successfully!",
      });
    });

  // Function to handle the search form submission
  document
    .getElementById("searchForm")
    .addEventListener("submit", function (event) {
      // Prevent the form from being submitted
      event.preventDefault();

      // Call the search function
      search();
    });

  var deleteButtons = document.getElementsByClassName("delete-button");
  for (var i = 0; i < deleteButtons.length; i++) {
    console.log("button");
    deleteButtons[i].addEventListener("click", function (event) {
      // Get the URL of the credential to delete
      var url = event.target.getAttribute("data-url");

      console.log("Deleting credential for " + url);

      // Delete the credential
      deleteCredential(url);

      // Update the displayed credentials
      //displayCredentials();
    });
  }
});
