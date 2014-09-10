# LOADING THOUGHTS

- For every view, have a list of image assets that need to be pre-loaded before that view has the loaded property
- When routing to a new view, if that view is not already "loaded", then pre-load the needed assets
- Show a loading screen until those assets have been loaded, then route to the view and update the view's "loaded" property
- Set up each view to have a loaded property reflecting whether assets are required