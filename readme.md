Travel Photos is designed for travel-photo enthusiasts. When you log on, you see a list of people you follow, with a green dot next to their name if they've posted any photos that you haven't seen yet. You can be selective about whose photos you choose to look at, instead of logging on and seeing a feed filled with all different types of photos from everyone you've chosen to follow. You can also re-arrange your list of friends, so your favorite photographers are most prominent. The main page displays a Google map, with markers for places-to-go that you've saved. To post photos, just sign in with Instagram, and you can access photos that you've posted to your account, then post them to Travel Photos. 

I built Travel Photos while a student at Fullstack Academy in NYC, using AngularJS, Node.js/Express, and Mongoose/MongoDB. The app is hosted at nk-travel-photos.herokuapp.com.

Details on how the app works:


When user accesses the main page:


1.) The main controller calls a method that retrieves the user's list of places-to-go, and then a method is called for displaying a Google map, with markers for each of the user's places-to-go.

2.) The sidebar controller calls a method to retrieve a list of people the user follows, along with data about whether or not each person has any new posts. If a user has a new post, a green dot is displayed next to their name. 


After navigating to My Posts:


1.) The myPosts controller calls a method that retrieves the user's posts, and then an object called lowResImageIds is populated with the id of each post. A maximum of 3 images is shown at first. This is because ctrl.displayNum is set to 3, or less, in postingService.retrieveMyPosts and the html file uses ctrl.displayNum to show only that number of images.

2.) If the user signed in with Instagram, they will see a button that allows them to retrieve images from their Instagram account. Each time they click the button, 10 images will be retrieved, but if an image's id is contained in lowResImageIds, then it will not be shown.

3.) The sidebar controller initializes the sidebar.


After clicking on a friend's name to see their photos:


1.) The friendPosts controller calls a method that retrieves the friend's posts. The same logic used to limit the number of posts shown on the My Posts page is used here. 

2.) The sidebar controller initializes the sidebar. Note that the method that initializes the sidebar is wrapped in a $timeout to ensure that it is called after the method that retrieves a friend's posts, so that the green dot indicating if a friend has new posts will go away when you look at that friend's photos.


Two ways of adding a place-to-go:


1.) Using the form on the main page. When this form is submitted, Google's geocoding API is used to find the lat/lon coordinates of the submitted address and then a method is called to save the place-to-go in the database.

2.) If a friend has a geotagged post, you can click on the button below the post and the geolocation associated with that post is sent to the database.



