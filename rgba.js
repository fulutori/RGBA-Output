var files = document.getElementById('files');
if(window.File && window.FileReader && window.FileList && window.Blob) {
	var rgba_list = [];
	var btn = document.getElementById("btn");
	function handleFileSelect(evt) {
		files = evt.target.files;

		for (var i = 0, f; f = files[i]; i++) {
			//画像以外は何もしない
			if (!f.type.match('image.*')) {
				continue;
			}

			var reader = new FileReader();

			//画像がアップロードされたら処理開始
			reader.onload = (function(theFile) {
							
				return function(e) {
					var canvas = document.getElementById('canvas');
					var ctx = canvas.getContext('2d');
					var img = new Image();
					var w = canvas.width;
					var h = canvas.height;
					var rgba="";
					img.src=e.target.result;
					img.onload = function() {
						ctx.drawImage(img, 0, 0, w, h);
						imgData = ctx.getImageData(0, 0, w, h);
						for(j=0;j<76800;j++){
							rgba += imgData.data[j];
							rgba += "\t";
							if((j+1)%w*4 == 0) rgba += "\r\n";
						}
						rgba_list.push(rgba);
					};

					//アップロードされた画像のサムネイルを表示.
					var span = document.createElement('span');
					span.innerHTML = ['<img class="thumb" src="', e.target.result,
														'" title="', escape(theFile.name), '"/>'].join('');
					document.getElementById('list').insertBefore(span, null);
					
				};
			})(f);

			//画像をURLとして読み込む
			reader.readAsDataURL(f);
		}
		btn.disabled = ""; //処理が終わったらボタンを有効化
	}

	//RGBA値をファイル出力する
	btn.onclick = function(){
	for (var i = 0, f; f = rgba_list[i]; i++) {
		var time = new Date().getTime();
		var blob = new Blob([rgba_list[i]], {type: "text/plain"});
		if(window.navigator.msSaveBlob) {
			window.navigator.msSaveBlob(blob, "out" + msec + ".txt");
		} else {
			var a = document.createElement("a");
			a.href = URL.createObjectURL(blob);
			a.target = '_blank';
			a.download = files[i].name.replace('.jpg','').replace('.png','').replace('.JPG','').replace('.PNG','').replace('.jpeg','').replace('.gif','') + '.txt';
			a.click();
		}
	text.innerHTML = "";
	}
};
	document.getElementById('files').addEventListener('change', handleFileSelect, false);
}