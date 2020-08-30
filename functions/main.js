const config = {
  apiKey: "AIzaSyCVgfTFieUGyf0JNrgOUSZ2xfGV1xKPlaI",
  authDomain: "html-fire-posts.firebaseapp.com",
  databaseURL: "https://html-fire-posts.firebaseio.com",
  projectId: "html-fire-posts",
  storageBucket: "html-fire-posts.appspot.com",
  messagingSenderId: "692310147839",
  appId: "1:692310147839:web:019ab0fc551a00028b82ca",
};

firebase.initializeApp(config);

const firestore = firebase.firestore();

const createForm = document.querySelector("#createForm");
const progressBar = document.querySelector("#progressBar");
const progressHandler = document.querySelector("#progressHandler");
const postSubmit = document.querySelector("#postSubmit");

if (createForm != null) {
  let d;
  createForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (
      document.getElementById("title").value != "" &&
      document.getElementById("content").value != "" &&
      document.getElementById("cover").files[0] != ""
    ) {
      let title = document.getElementById("title").value;
      let content = document.getElementById("content").value;
      let cover = document.getElementById("cover").files[0];

      console.log(cover);

      const storageRef = firebase.storage().ref();
      const storageChild = storageRef.child(cover.name);
      console.log("Uploading file...");
      const postCover = storageChild.put(cover);

      await new Promise((resolve) => {
        postCover.on(
          "state_changed",
          (snapshot) => {
            let progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
          },
          (error) => {
            console.log(error);
          },
          async () => {
            const downloadURL = await storageChild.getDownloadURL();
            d = downloadURL;
            console.log(d);
            resolve();
          }
        );
      });

      const fileRef = await firebase.storage().refFromURL(d);

      let post = {
        title,
        content,
        cover: d,
        fileref: fileRef.location.path, //image.jpg
      };

      await firebase.firestore().collection("posts").add(post);
      console.log("post added successfully");

      if (postSubmit != null) {
        window.location.replace("index.html");
        postSubmit.disabled = false;
      }
    } else {
      console.log("must fill all the inputs");
    }
  });
}
