$(document).ready(function () {
  // Grabbing references to the "survivor-name" input and survivor container, and the table "tbody"

  var survivorList = $('tbody')
  var survivorContainer = $('.survivor-container')
  var lastName = $('#Lastname')
  var firstName = $('#Firstname')
  // Adding listeners to form to create an object and button to delete object
  var audio = new Audio('../assets/audio/zomAudio2.wav');
  audio.play();

  $('#createSurvivor').on('click', function handleFormSubmit (event) {
    event.preventDefault()

    if (!firstName.val().trim() || !lastName.val().trim()) {
      return
    }
    var newSurvivor = {
      firstName: firstName.val().trim(),
      lastName: lastName.val().trim()
    }
    console.log(newSurvivor)
    /// ///////////
    // you have to pass the newSurvivor or else
    submitPost(newSurvivor)
  })

  function submitPost (Survivor) {
    /// ////////////
    // or else over here Survivor has no value
    $.post('/api/survivor', Survivor, function () {
      console.log('posted')
    })
  }

  ///////////////////////////////////////
  function getSurvivors () {
    $.get('/api/survivor', function (data) {
      for (var i = 0; i < data.length; i++) {
        var row = createNewRow2(data[i], i)
        $('#survivorBody').append(row)
      }
    })
  }
  getSurvivors()

  function createNewRow2 (survivor, index) {
    var row = '<tr>' +
      '<th scope="row">' + (index + 1) + '</th>' +
      '<td>' + survivor.SurvivorID + '</td>' +
      '<td>' + survivor.FirstName + '</td>' +
      '<td>' + survivor.LastName + '</td>' +
      '<td>' + survivor.SurvivorItems + '</td>' +
    '</tr>'

    return row
  }
  ////////////////////////////////////////
  // //Grabbing list of Survivors
  // getSurvivors()

  // //Function that handles what happens when the form is submitted to create a new survivor
  // function handleSurvivorFormSubmit (event) {
  // event.preventDefault()
  // // Don't do anything if the name fields hasn't been filled out
  // if (!nameInput.val().trim().trim()) {
  //   return
  // }
  // // Calling upsertSurvivor function and passing in the value of the name input
  // upsertSurvivor({
  //   name: nameInput.val().trim()
  // })
  // }
  // Function for creating a new list of row for Survivor
  function upsertSurvivor (survivorData) {
    $.post('/api/survivor', survivorData).then(getSurvivors)
  }

  function createSurvivorRow (survivorData) {
    var newTr = $('<tr>')
    newTr.data('survivor', survivorData)
    newTr.append('<td>' + survivorData.name + '</td>')
    newTr.append('<td>' + survivorData.Posts.length + '</td>')
    newTr.append("<td><a href='/inventory?survior_id=" + survivorData.id + "'>Go to Posts</a></td>")
    newTr.append("<td><a href='/ims?survivor_id=" + survivorData.id + "'>Create a Post</a></td>")
    newTr.append("<td><a style='cursor:pointer; color:red' class='delete-survivor'>Delete Survivor</a></td>")

    return newTr
  }

 
  function renderSurvivorList (rows) {
    survivorList.children().not(':last').remove()
    survivorContainer.children('.alert').remove()
    if (rows.length) {
      console.log(rows)
      survivorList.prepend(rows)
    } else {
      renderEmpty()
    }
  }

  function renderEmpty () {
    var alertDiv = $('<div>')
    alertDiv.addClass('alert alert-danger')
    alertDiv.text('You must create a Survivor before you can create a Post.')
    survivorContainer.append(alertDiv)
  }

  function handleDeleteButtonPress () {
    var listItemData = $(this).parent('td').parent('tr').data('survivor')
    var id = listItemData.id
    $.ajax({
      method: 'DELETE',
      url: '/api/survivor/' + id
    }).then(getSurvivors)
  }
})
