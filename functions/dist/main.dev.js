"use strict";

var config = {
  apiKey: "AIzaSyCVgfTFieUGyf0JNrgOUSZ2xfGV1xKPlaI",
  authDomain: "html-fire-posts.firebaseapp.com",
  databaseURL: "https://html-fire-posts.firebaseio.com",
  projectId: "html-fire-posts",
  storageBucket: "html-fire-posts.appspot.com",
  messagingSenderId: "692310147839",
  appId: "1:692310147839:web:019ab0fc551a00028b82ca"
};
firebase.initializeApp(config);
var firestore = firebase.firestore();
var createForm = document.querySelector("#createForm");
var progressBar = document.querySelector("#progressBar");
var progressHandler = document.querySelector("#progressHandler");
var postSubmit = document.querySelector("#postSubmit");

if (createForm != null) {
  var d;
  createForm.addEventListener("submit", function _callee2(e) {
    var title, content, cover, storageRef, storageChild, postCover, fileRef, post;
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            e.preventDefault();

            if (!(document.getElementById("title").value != "" && document.getElementById("content").value != "" && document.getElementById("cover").files[0] != "")) {
              _context2.next = 22;
              break;
            }

            title = document.getElementById("title").value;
            content = document.getElementById("content").value;
            cover = document.getElementById("cover").files[0];
            console.log(cover);
            storageRef = firebase.storage().ref();
            storageChild = storageRef.child(cover.name);
            console.log("Uploading file...");
            postCover = storageChild.put(cover);
            _context2.next = 12;
            return regeneratorRuntime.awrap(new Promise(function (resolve) {
              postCover.on("state_changed", function (snapshot) {
                var progress = snapshot.bytesTransferred / snapshot.totalBytes * 100;
                console.log(Math.trunc(progress));

                if (progressHandler != null) {
                  progressHandler.style.display = true;
                }

                if (postSubmit != null) {
                  postSubmit.disabled = true;
                }

                if (progressBar != null) {
                  progressBar.value = progress;
                }
              }, function (error) {
                console.log(error);
              }, function _callee() {
                var downloadURL;
                return regeneratorRuntime.async(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return regeneratorRuntime.awrap(storageChild.getDownloadURL());

                      case 2:
                        downloadURL = _context.sent;
                        d = downloadURL;
                        console.log(d);
                        resolve();

                      case 6:
                      case "end":
                        return _context.stop();
                    }
                  }
                });
              });
            }));

          case 12:
            _context2.next = 14;
            return regeneratorRuntime.awrap(firebase.storage().refFromURL(d));

          case 14:
            fileRef = _context2.sent;
            post = {
              title: title,
              content: content,
              cover: d,
              fileref: fileRef.location.path //image.jpg

            };
            _context2.next = 18;
            return regeneratorRuntime.awrap(firebase.firestore().collection("posts").add(post));

          case 18:
            console.log("post added successfully");

            if (postSubmit != null) {
              window.location.replace("index.html");
              postSubmit.disabled = false;
            }

            _context2.next = 23;
            break;

          case 22:
            console.log("must fill all the inputs");

          case 23:
          case "end":
            return _context2.stop();
        }
      }
    });
  });
}