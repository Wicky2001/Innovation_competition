export function handleSubmit(event, clientId) {
  event.preventDefault(); // Prevent the default form submission behavior
  const formData = new FormData();

  const answerText = document.getElementById("AnswerText").value;
  const markingText = document.getElementById("MarkingText").value;

  if (markingText.length > 0) {
    console.log("Answer Text:", answerText);
    console.log("Marking Text:", markingText);

    var textData = { answerText: answerText, markingText: markingText };
    fetch(`http://localhost:5001/upload_text`, {
      method: "POST",
      body: textData,
    })
      .then((response) => response.text())
      .then((text) => {
        console.log(text);
        //   messageDiv.innerText = "Processing...";
      })
      .catch((error) => {
        console.error("Error occurred", error);
        //   messageDiv.innerText = 'Error occurred while uploading files.';
      });
  } else {
    // Get references to the file input elements and message div
    const markingSchemeFiles = document.getElementById("markingScheme");
    const answerSheetFiles = document.getElementById("answerSheet");

    // Create a new FormData object to hold the files

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
}
