/* 
it uses promises out of the box. So this get method returns a promise and therefore using await on it, async await of course works.
*/

//! GET Request
const listElement = document.querySelector('.posts');
const postTemplate = document.getElementById('single-post');

async function fetchPosts() {
   try {
      const responseData = await axios.get( //! axios.get('url')
         'https://jsonplaceholder.typicode.com/posts'
      );
      //! axios uses promises out of the box. So this get method returns a promise and therefore using await on it, async await of course works.

      // console.log(responseData);
      /*
      ! axios returns an object but unlike the fetch API the object is ready to be used. So we don't need to convert the streamed data into snapshot as we had to do it here in the fetch API, we also don't need to parse it from JSON to Javascript data, instead we get that automatically converted snapshot data here as part of our response object on that (data field) and that data field therefore in this case is the array.
      */

      const listOfPosts = responseData.data; //! .data is a field which contains all the data of the object responseData which was returned by axios 

      //! loop over the JSON data
      for (const post of listOfPosts) {
         const postEl = document.importNode(postTemplate.content, true);
         postEl.querySelector('h2').textContent = post.title.toUpperCase();
         postEl.querySelector('p').textContent = post.body;
         postEl.querySelector('li').id = post.id; //! to get the id for DELETE request
         listElement.append(postEl);
      }
   } catch (error) {
      alert(error.message); //! axios will automatically give a nice error message by seeing the status property
      // console.log(error.responseData); //! it give an object with all the important properties about the error
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

   const responseData = await axios.post('https://jsonplaceholder.typicode.com/posts', post); //! axios.post
   /* 
   ! axios takes the post which is not JSON but a normal Javascript object and it's then transforms this to JSON and it also adds the header. it's then stringifies this to convert it to JSON and sets the application/json header. we would add the FormData and axios would detect this as well.
   */
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
      axios.delete(`https://jsonplaceholder.typicode.com/posts/${postId}`); //! axios.delete
   }
});
