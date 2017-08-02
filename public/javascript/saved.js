$(document).ready(function() {
	
  var articleContainer = $(".article-container");

  $(document).on("click", ".btn.delete", handleArticleDelete);
  $(document).on("click", ".btn.notes", handleArticleNotes);
  $(document).on("click", ".btn.save", handleNoteSave);
  $(document).on("click", ".btn.note-delete", handleNoteDelete);

  initPage();

  function initPage() {

    articleContainer.empty();
    $.get("/api/headlines?saved=true").then(function(data) {
      // If we have headlines, render them to the page
      if (data && data.length) {
        renderArticles(data);
      } else {

        renderEmpty();
      }
    });
  }

  function renderArticles(articles) {

    var articlePanels = [];

    for (var i = 0; i < articles.length; i++) {
      articlePanels.push(createPanel(articles[i]));
    }

    articleContainer.append(articlePanels);
  }

  function createPanel(article) {

    var panel =
      $(["<div class='panel panel-default'>",
        "<div class='panel-heading'>",
        "<h3>",
        article.headline,
        "<a class='btn btn-danger delete'>",
        "Delete From Saved",
        "</a>",
        "<a class='btn btn-info notes'>Article Notes</a>",
        "</h3>",
        "</div>",
        "<div class='panel-body'>",
        article.summary,
        "</div>",
        "</div>"
      ].join(""));
    panel.attr("data-id", article._id);
    panel.attr("data-headline", article.headline);

    panel.data("_id", article._id);
    // We return the constructed panel jQuery element
    return panel;
  }

  function renderEmpty() {

    var emptyAlert =
      $(["<div class='alert alert-warning text-center'>",
        "<h4>Uh Oh. Looks like we don't have any saved articles.</h4>",
        "</div>",
        "<div class='panel panel-default'>",
        "<div class='panel-heading text-center'>",
        "<h3>Would You Like to Browse Available Articles?</h3>",
        "</div>",
        "<div class='panel-body text-center'>",
        "<h4><a href='/'>Browse Articles</a></h4>",
        "</div>",
        "</div>"
      ].join(""));
    // Appending this data to the page
    articleContainer.append(emptyAlert);
  }

  function renderNotesList(data) {

    var notesToRender = [];
    var currentNote;
    if (!data.notes.length) {

      currentNote = [
        "<li class='list-group-item'>",
        "No notes for this article yet.",
        "</li>"
      ].join("");
      notesToRender.push(currentNote);
    }
    else {
      // If we do have notes, go through each one
      for (var i = 0; i < data.notes.length; i++) {
        // Constructs an li element to contain our noteText and a delete button
        currentNote = $([
          "<li class='list-group-item note'>",
          data.notes[i].text,
          "<button class='btn btn-danger note-delete'>x</button>",
          "</li>"
        ].join(""));
        
        currentNote.children("button").data("_id", data.notes[i]._id);
        
        notesToRender.push(currentNote);
      }
    }
    
    $(".note-container").append(notesToRender);
  }

  function handleArticleDelete() {
    
    var articleToDelete = $(this).parents(".panel").data();
    console.log(articleToDelete);
    $.ajax({
      method: "delete",
      url: "/api/headlines/" + articleToDelete._id,
      // data: {
      //   saved: false
      // }
    }).then(function(data) {
      
      if (data.ok) {
        initPage();
      }
    });

  }

  function handleArticleNotes() {
    
    var currentArticle = $(this).parents(".panel").data();
    

    // Grab any notes with this headline/article id
    $.get("/api/notes/" + currentArticle.id).then(function(data) {
      console.log(currentArticle)
      console.log(data); //only pulling ALL notes info
      var modalText = [
        "<div class='container-fluid text-center'>",
        "<h4>Notes For Article: ",
        currentArticle.headline,
        "</h4>",
        "<hr />",
        "<ul class='list-group note-container'>",
        "</ul>",
        "<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
        "<button class='btn btn-success save'>Save Note</button>",
        "</div>"
      ].join("");

      bootbox.dialog({
        message: modalText,
        closeButton: true
      });
      var noteData = {
        headline: currentArticle.headline,
        _headlineId: currentArticle._id,
        notes: data || []
      };
      console.log(noteData)

      $(".btn.save").data("article", noteData);

      renderNotesList(noteData);
    });
  }

  function handleNoteSave() {
    var noteData;
    var newNote = $(".bootbox-body textarea").val().trim();
    console.log(newNote);
    if (newNote) {
      noteData = {
        _id: $(this).data("article")._id,
        text: newNote
      };
      console.log(noteData);

      // $.ajax({
      //   method: "POST",
      //   url: "/api/notes/"
      //   data: "noteData"
      // }).then(function(data) {
      //   console.log(data);
      // });
      $.post("/api/notes", noteData).then(function() {
        // When complete, close the modal
        bootbox.hideAll();
      });
    }
  }

  function handleNoteDelete() {
    
    var noteToDelete = $(this).data("_id");
    console.log(noteToDelete);
    var headlineID;

    
    $.ajax({
      url: "/api/notes/" + noteToDelete,
      method: "DELETE"
    }).then(function() {
      // When done, hide the modal
      bootbox.hideAll();
    });
  }

});