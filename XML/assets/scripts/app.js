/* 
* Our backend would typically be an API and that stands for Application Programming Interface, that means it's a web server which exposes different endpoints, different URLs to which we can send requests and based on which request we send to which URL, different things will happen on the server.It's the engineers working on that server side logic that decide which endpoints exist, so which HttpRequests are supported, which URLs are offered. 
* Traditionally the page and the browser might have communicated with that server directly but that's not what we want here because that would mean that our server always needs to return a brand new HTML page and therefore the page would need to reload/ re-rendered,it might not offer the best possible user experience Instead what we want to do is we want to reach out to these different endpoints.
* Therefore this server doesn't really want a default request sent by the browser but needs specific requests targeting these specific endpoints and that's what we can do with the help of Javascript, with some behind the scenes communication without us refreshing the web page (HTTP Requests - GET, POST, PUT, DELETE). Javascript to send requests that are correctly configured and hold all the data the server wants to these individual endpoints.
* More: (https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)

! How to send HttpRequest
* Create a new XMLHttpRequest object and this object will allow you to send HttpRequests, it is built into the browser and all browsers support this object,
* Now to send a request or to get started, we need to configure the request and the first step for that is to use our object and call the open method.
* Open takes at two arguments and the first one describes the HTTP method you want to use and the second one describes the URL to which we want to send that request. So we basically configured the request, we informed the xhr object which kind of requests we want to send to which address.
* Now in order to send it, we have to call xhr send, this will send the request. So the request indeed was sent and we get back some data. Now we just need to find out how to use that data and for that, we first of all have to understand the data format.

! JSON Data & Parsing Data
* Now the format of the data is really important, you exchange data between your client side and the server side in a certain format and technically, there are no restrictions but we use the data format which is called JSON.
* JSON stands for Javascript Object Notation. It looks like Javascript objects in an array and JSON is derived from Javascript data types (arrays and objects)
* In JSON you can only store data, you can't have methods and you can't send functions to a server. In addition, your property names have to be wrapped between double quotes, single quotes would not be allowed and it has to be wrapped. Now as values you can use numbers, booleans, strings, other objects or arrays (nested objects and nested arrays) and null.
* Now we have to parse the data to use it. We have to listen the data first to parse it. We use onload method to listen the data.
*/

//! Complete XMLHttpRequest

function sendHttpRequest(method, url, data) { //! data used for POST request
   const promise = new Promise((resolve, reject) => {

      //! Create a new XMLHttpRequest object and this object will allow you to send HttpRequests, it is built into the browser and all browsers support this object
      const xhr = new XMLHttpRequest();

      //! Headers can be important for some APIs, you need to describe which type of data you sending for example or other APIs might need some extra authentication data and headers are basically metadata you can attach to outgoing requests. If you inspect requests, you see there are some default headers added
      xhr.setRequestHeader('Content-Type', 'application/json');

      //! Now to send a request or to get started, we need to configure the request and the first step for that is to use our object and call the open method. Open takes at two arguments and the first one describes the HTTP method you want to use and the second one describes the URL to which we want to send that request. So we basically configured the request, we informed the xhr object which kind of requests we want to send to which address.
      xhr.open(method, url);

      // xhr.responseType = 'json'; if we are using this then no need to parse the response

      //! onload method to listen the request
      xhr.onload = function () {
         if (xhr.status >= 200 && xhr.status < 300) { //! only for success status 

            resolve(xhr.response);
            //! xhr.response gives you JSON data and in order to use it, you have to convert the JSON data to Javascript datatype(arrays, objects) using built-in static helper methods (parse and stringify)

         } else {  //! when internal error happens in (wrong url, request, server down)
            reject(new Error('Something went wrong!'));
         }
      };

      //! when external error happens (no internet)
      xhr.onerror = function () {
         reject(new Error('Failed to send request!'));
      };

      //! Now in order to send it, we have to call xhr send, this will send the request. So the request indeed was sent and we get back some data.
      xhr.send(JSON.stringify(data)); //! stringify => convert Javascript datatype to JSON data because we are sending data

   });

   return promise;
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

      const listOfPosts = JSON.parse(responseData); //! parse => convert JSON data to Javascript datatype because we are getting data

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

fetchButton.addEventListener('click', fetchPosts); //! When fetch button is clicked show the data

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