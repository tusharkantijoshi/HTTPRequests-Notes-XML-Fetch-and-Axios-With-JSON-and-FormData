/* 
* Now besides different ways of sending HttpRequests, we also can send different data, it always depends on the server and the URL you're sending this to, which kind of data the server accepts.

* Now you can send files, you can send binary data and add this as a body here, so you could add a pointer at a file which a user picked in a file picker for example or another very popular data format, you could add FormData

* Now again, it's important to realize that not all APIs support FormData, if an API wants JSON data, you can't use this no matter how convenient you find it to be but if you have an API, an API endpoint, so a specific URL HTTP method combination that does support FormData you can use this approach and therefore form data besides JSON is also an important data structure you should be aware of when we're talking about sending data with HttpRequests from client side Javascript to a server.
*/

sendHttpRequest = (method, url, data) => {

  return fetch(url, {
    method: method,
    body: data, //! Form Data 
    //! the fetch API will automatically see that it's form data and automatically send the right headers.
  })
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      } else {
        return response.json().then(errData => {
          console.log(errData);
          throw new Error('Something went wrong - server-side.');
        });
      }
    })
    .catch(error => {
      console.log(error);
      throw new Error('Something went wrong!');
    });
}

//! GET Request
const listElement = document.querySelector('.posts');
const postTemplate = document.getElementById('single-post');

fetchPosts = async () => {
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
createPost = async (title, content) => {
  const userId = Math.random();
  const post = {
    title: title,
    body: content,
    userId: userId
  };

  //! Form Data
  const fd = new FormData(form); //! pass a pointer to your form element to FormData then Javascript will try to automatically collect all the data from the form.

  //! Or you can also manually append the form input 
  // fd.append('title', title);
  // fd.append('body', content);
  // fd.append('userId', userId);

  /* 
  ! Now for it to succeed though, you need to make sure that your inputs in HTML have a name attribute, title and here, may be content or actually body because the API wants a field named body. The name attribute is important otherwise FormData is not able to identify these inputs and get the data out of there and store it correctly in the FormData.
  */

  sendHttpRequest('POST', 'https://jsonplaceholder.typicode.com/posts', fd);
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
  if (event.target.tagName === 'BUTTON') {
    const postId = event.target.closest('li').id;
    sendHttpRequest(
      'DELETE',
      `https://jsonplaceholder.typicode.com/posts/${postId}`
    );
  }
});