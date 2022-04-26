/* 
* HttpRequests was introduced so we could fetch XML data behind the scenes. Nowadays of course it's more common to use JSON data, the name however still is the same. Now the fetch API is more modern alternative which was added to browsers a few years ago.
*/

//! Complete Fetch
sendHttpRequest = (method, url, data) => {

   //! by default fetch is promise based. We don't have to promisify ourselves, it uses promises on its own.

   return fetch(url, {

      //! Unlike XMLHttpRequest, you don't pass the request method as an argument, instead you can pass a second argument which should be an object where you can configure the request and there you've got a couple of keys you can set.

      method: method, //! by default it's GET

      body: JSON.stringify(data), //! stringify => convert Javascript datatype to JSON data because we are sending data

      //! Headers can be important for some APIs, you need to describe which type of data you sending for example or other APIs might need some extra authentication data and headers are basically metadata you can attach to outgoing requests. If you inspect requests, you see there are some default headers added
      headers: {
         'Content-Type': 'application/json'
      }
   }).then(response => {
      if (response.status >= 200 && response.status < 300) {  //! only for success status 

         return response.json();
         //! Unlike XMLHttpRequest, fetch does not give us the parsed response as we had with xhr.response but instead, it gives us a streamed response, you need to call response.JSON to convert the streamed unparsed response body into a parsed body. So now with that, the overall sendHttpRequest method will yield a promise which will eventually return that parsed response data, response JSON is important for that.

         // response.text() // to have a plain text
         // response.blob() // to download a file

      } else {
         return response.json()
            .then(errData => { //! when internal error happens (wrong url, request, server down)
               console.log(errData); //! error data from server
               throw new Error('Something went wrong - server-side.');
            });
      }
   }).catch(error => { //! when external error happens (no internet)
      console.log(error);
      throw new Error('Something went wrong!');
   });
}

//! GET Request
const listElement = document.querySelector('.posts');
const postTemplate = document.getElementById('single-post');

async function fetchPosts() {
   try {
      const responseData = await sendHttpRequest(
         'GET',
         'https://jsonplaceholder.typicode.com/posts'
      );

      const listOfPosts = responseData;

      //! loop over the JSON data
      for (const post of listOfPosts) {
         const postEl = document.importNode(postTemplate.content, true);
         postEl.querySelector('h2').textContent = post.title.toUpperCase();
         postEl.querySelector('p').textContent = post.body;
         postEl.querySelector('li').id = post.id; //! to get the id for DELETE request
         listElement.append(postEl);
      }
   } catch (error) {
      alert(error.message);
   }
}

//! POST Request
async function createPost(title, content) {
   const userId = Math.random();
   const post = {
      title: title,
      body: content,
      userId: userId
   };

   sendHttpRequest('POST', 'https://jsonplaceholder.typicode.com/posts', post);
}

const form = document.querySelector('#new-post form');
const fetchButton = document.querySelector('#available-posts button');

fetchButton.addEventListener('click', fetchPosts);  //! When fetch button is clicked show the data

form.addEventListener('submit', event => { //! when form button is clicked submit the data
   event.preventDefault();
   const enteredTitle = event.currentTarget.querySelector('#title').value;
   const enteredContent = event.currentTarget.querySelector('#content').value;

   createPost(enteredTitle, enteredContent);
});

//! DELETE Request
const postList = document.querySelector('ul');

postList.addEventListener('click', event => {
   if (event.target.tagName === 'BUTTON') { //! only when button is clicked
      const postId = event.target.closest('li').id; //! to get the clicked button ID
      sendHttpRequest(
         'DELETE',
         `https://jsonplaceholder.typicode.com/posts/${postId}`
      );
   }
});
