var GoogleCloudManager = function(filepath, fileSizeInBytes,token) {
	this.filepath = filepath;
	this.fileSizeInBytes= fileSizeInBytes;
	this.name = "ptcloud.pts";
	this.token = token;
	var requestUrl = "https://www.googleapis.com/upload/storage/v1/b/myBucket/o?uploadType=resumable";
	this.getAuthToken = function() {
		return this.token;
	}
	
	this.initiateRequest = function() {
		var url = requestUrl + "&name=" + this.name;
		var ctx = this;
		var payload = {
			url:url,
			type: "POST",
			headers: {
				"Authorization": "Bearer " + this.getAuthToken(),
				"Content-Type": "application/json; charset=UTF-8",
				"X-Upload-Content-Type": "binary/octet-stream",
				"X-Upload-Content-Length": this.fileSizeInBytes.toString()
			},
			success: function(data, textStatus, request) {
				var location = request.getResponseHeader('Location');
				ctx.uploadFile(location);
			},
			error: function(request, textStatus, errorThrown) {
				
			}
		}
		$.ajax(payload);		
	}
	
	this.uploadFile = function(url) {
		app.use(
			multer({ 
				dest: url,
				rename: function (fieldname, filename) {
					return filename;
				},
				onFileUploadStart: function (file) {
					console.log(file.originalname + ' is starting ...')
				},
				onFileUploadComplete: function (file) {
					console.log(file.fieldname + ' uploaded to  ' + file.path)
					done=true;
				}
			})
		);
		app.put(this.filepath,function(req,res){
			if(done==true){
				console.log(req.files);
				res.end("File uploaded.");
			}
		});
	}	
	this.init = function() {
		var $ = require('jquery'),
		    XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;		
		$.support.cors = true;
		$.ajaxSettings.xhr = function() {
		    return new XMLHttpRequest();
		};
		var express     =    require("express");
		var multer      =    require('multer');
		var app         =    express();		
	}
	this.init();
	
	this.upload = function() {
		initiateRequest();
	}
}

var arguments = {};
process.argv.forEach(function(val, index, array) {
	switch(index) {
		case 0:		arguments["filepath"] = val;break;
		case 1:		arguments["fileSizeInBytes"] = val;break;
		case 2:		arguments["token"] = val;break;
	}
});

var mgr = new GoogleCloudManager(arguments["filepath"],arguments["fileSizeInBytes"],arguments["token"]);
mgr.update();
