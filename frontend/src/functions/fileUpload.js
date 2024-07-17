export function handleSubmit(event, clientId) {
  event.preventDefault(); // Prevent the default form submission behavior

  // Get references to the file input elements and message div
  const markingSchemeFiles = document.getElementById("markingScheme");
  const answerSheetFiles = document.getElementById("answerSheet");
  const messageDiv = document.getElementById("message");

  // Create a new FormData object to hold the files
  const formData = new FormData();

  // Append marking scheme files to FormData
  for (let i = 0; i < markingSchemeFiles.files.length; i++) {
    formData.append("markingSchemeFiles", markingSchemeFiles.files[i]);
  }

  // Append answer sheet files to FormData
  for (let i = 0; i < answerSheetFiles.files.length; i++) {
    formData.append("answerSheetFiles", answerSheetFiles.files[i]);
  }

  // Log FormData content (for debugging)
  for (let pair of formData.entries()) {
    console.log(pair[0] + ": " + pair[1].name);
  }
  // console.log(formData.values);
  // Send the files to the server using Fetch API
  fetch(`http://localhost:5001/upload_files?clientId=${clientId}`, {
    method: "POST",
    body: formData,
  })
    .then((response) => response.text())
    .then((text) => {
      console.log("ffffffffffffffffffffff");
      //   messageDiv.innerText = "Processing...";
    })
    .catch((error) => {
      console.error("Error occurred", error);
      //   messageDiv.innerText = 'Error occurred while uploading files.';
    });
}
