// fetch('https://run.mocky.io/v3/e2178c49-36a1-4d87-91cb-ae8e6873b4b4').then((res) => res.json()).then((response) => {

//   console.log(response.items);
//   if(response?.items) {
//   	const storiesOptions = [];
    
//     response.items.forEach((story) => {
//       const readyStory = {
//         id: story.story_id,
// 				name: story.name,
//         photo: story.thumbnail,
// 				items: [],
// 			};
      
//       readyStory.items = story.contents.map((item) => ({
//         id: item.content_id,
// 				type: item.type,
//         url: item.content_path,
//         prod: item.link
//       }));
      
// 			storiesOptions.push(readyStory);

//     })
    
// 		stroriesAjaxResponse(storiesOptions);
//   }
// })


$.ajax({
  url: 'https://run.mocky.io/v3/e345e142-4767-4b1a-94e7-f46780ed0af7',
  method: 'get',
  dataType: 'json',
  success: function(response) { 
    // console.log(response);
    if(response?.items) {
      const storiesOptions = [];
      
      response.items.forEach((story) => {
        const readyStory = {
          id: story.story_id,
          name: story.name,
          enable: story.enable,
          photo: story.thumbnail,
          items: [],
        };
        
        readyStory.items = story.contents.map((item) => ({
          id: item.content_id,
          type: item.type,
          url: item.content_path,
          prod: item.link,
          goods: item.products
        }));

        storiesOptions.push(readyStory);
        // console.log(readyStory);
  
      });
      
      stroriesAjaxResponse(storiesOptions);
    }
  }
});


function stroriesAjaxResponse(stories) {
  new StoriesSlider(document.getElementById("app-stories"), { stories });
}



