This project is an AWS lambda function which interacts with the Giffer Service to render a clip of a movie which contains a specified quote.

The response from this function is meant to be consumed by Amazon Alexa, which also drives the usage of the module.

The response from the Giffer Service contains a link to the generated MP4 of the clip.  This clip is shown on the Amazon Show, while Echo provides the user ways to interact with the module.

To deploy this, simply zip up the entire contents of the project, and load it into your AWS Lambda function.

The wonderful Giffer service is provided and maintained by @grdaneault