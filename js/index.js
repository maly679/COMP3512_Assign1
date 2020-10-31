document.addEventListener('DOMContentLoaded', function () {
	//global variable declarations
	let map;
	let clng;
	let clat;
	let glist;
	const galleryURL = 'https://www.randyconnolly.com/funwebdev/3rd/api/art/galleries.php';

	//function declararions

	function createMarker(map, latitude, longitude, city) {
		let imageLatLong = {
			lat: latitude,
			lng: longitude
		};
		let marker = new google.maps.Marker({
			position: imageLatLong,
			title: city,
			map: map
		});

	}

	function getIDFromClass(classNames) {
		const splitNames = classNames.split(" ");
		for (let i = 0; i < splitNames.length; i++) {
			if (i == 2) {
				return splitNames[i];
			}
		}

	}

	function toggleGalleryList() {
		document.querySelector(".galleryButton").classList.toggle("showGallery");
		if (document.querySelector(".galleryButton").className != "galleryButton showGallery") {
			document.querySelector(".galleryInformation").style.gridColumn = "1 / span 2";
			document.querySelector(".galleryInformation").style.gridRow = "2 / span 1";
			document.querySelector(".galleries").style.display = "none";
			document.querySelector("#map").style.gridRow = "3 / span 1";
			document.querySelector("#map").style.gridColumn = "1 / span 2";
			document.querySelector(".galleryButton").textContent = "Show galleries";

		} else {

			displayRegView();
		}
	}

	function displayRegView() {
		document.querySelector(".galleries").style.display = "block";
		document.querySelector("#map").style.gridRow = "3 / span 1";
		document.querySelector("#map").style.gridColumn = "2 / span 1";
		document.querySelector(".paintings").style.gridRow = "2 / span 2";
		document.querySelector(".galleryInformation").style.gridRow = "2 / span 1";
		document.querySelector(".galleryInformation").style.gridColumn = "2 / span 1";
		document.querySelector(".galleryButton").textContent = "Hide galleries";
		
	}

	function updateGalleryID(id) {
		document.querySelector(".paintings").className = `paintings box ${id}`;
		
	}

	function getPaintingInfoURL(id) {
		let paintingInfoURL = `https://www.randyconnolly.com/funwebdev/3rd/api/art/paintings.php?gallery=${id}`;
		return paintingInfoURL;
		
	}


	function makeButton() {
		//creating show/hide gallery list button
		const buttonShowGallery = document.createElement("button");
		document.querySelector(".h header h2").insertAdjacentElement("afterend", buttonShowGallery);
		buttonShowGallery.classList.add("showGallery");
		buttonShowGallery.classList.add("galleryButton");
		buttonShowGallery.style.width = "100px";
		buttonShowGallery.style.height = "60px";
		buttonShowGallery.textContent = "Hide galleries";
		buttonShowGallery.style.fontStyle = "oblique";
		buttonShowGallery.style.backgroundColor = "lightgray";
		buttonShowGallery.style.borderRadius = "5px";
		buttonShowGallery.style.border = "3px solid white";
		buttonShowGallery.style.fontFamily = "Times New Roman, Times, serif";
		
	}

	function addGalleryList(data) {
		data.sort();
		//adding data to global array to allow for future processing.
		glist = [...data];
		//reintialize and add gallery listings to gallery list.
		document.querySelector("#galleryList").innerHTML = "";
		for (let d of data) {
			let optionT = document.createElement("li");
			optionT.textContent = d.GalleryName;
			optionT.setAttribute("id", d.GalleryID);
			document.querySelector("#galleryList").appendChild(optionT);
		}
	}

	function processGallerySelection(e) {
		document.querySelector("#galleryInfo").innerHTML = "";
		//iniiating post-gallery selection process
		for (let gl of glist) {

			if (e.target.getAttribute("id") == gl.GalleryID) {
				//updating id of selected gallery, in order to match that of the listed paintings that will be generated
				updateGalleryID(gl.GalleryID);
				//assigning gallery information
				let option = document.createElement("li");
				option.textContent = gl.GalleryName;
				document.querySelector("#galleryInfo").appendChild(option);
				if (gl.GalleryName != gl.GalleryNativeName) {
					option = document.createElement("li");
					option.textContent = gl.GalleryNativeName;
					document.querySelector("#galleryInfo").appendChild(option);
				}
				option = document.createElement("li");
				option.textContent = gl.GalleryCity;
				document.querySelector("#galleryInfo").appendChild(option);
				option = document.createElement("li");
				option.textContent = gl.GalleryAddress;
				document.querySelector("#galleryInfo").appendChild(option);
				option = document.createElement("li");
				option.textContent = gl.GalleryCountry;
				document.querySelector("#galleryInfo").appendChild(option);
				//assingining website of gallery
				const gWebsiteTag = document.createElement("a");
				gWebsiteTag.setAttribute("href", gl.GalleryWebSite);
				gWebsiteTag.textContent = gl.GalleryWebSite;
				option = document.createElement("li");
				option.appendChild(gWebsiteTag);
				document.querySelector("#galleryInfo").appendChild(option);
				//assining longitude and lattitude to global variables and initiating map
				clng = gl.Longitude;
				clat = gl.Latitude;
				initMap();
				createMarker(map, clat, clng, gl.city);

			}

		}
		//initiate painting list processing
		processPaintingsInfo(e.target.getAttribute("id"), "LastName");
	}
	
	//processing header selection of painting list
	function addHeaderClickListeners(paintingH2) {
		for (let ph of paintingH2) {
			ph.addEventListener('click', function (e) {
				if (e.target.textContent == "Title") {
					processPaintingsInfo(getIDFromClass(document.querySelector(".paintings").className), "Title");
				} else {
					if (e.target.textContent == "Artist") {
						processPaintingsInfo(getIDFromClass(document.querySelector(".paintings").className), "LastName");
					} else {
						if (e.target.textContent == "Year") {
							processPaintingsInfo(getIDFromClass(document.querySelector(".paintings").className), "YearOfWork");

						}
					}
				}


			});
		}
	}
	
	//sorting painting list based on selected header
	function sortData(sortBase, data) {
		if (sortBase == "LastName") {
			data.sort(function (a, b) {

				if (a.LastName < b.LastName) {

					return -1;
				} else {
					if (a.LastName > b.LastName) {

						return 1;
					} else {
						return 0;
					}
				}

			});
		} else {

			if (sortBase == "Title") {
				data.sort(function (a, b) {

					if (a.Title < b.Title) {

						return -1;
					} else {
						if (a.Title > b.Title) {

							return 1;
						} else {
							return 0;
						}
					}

				});

			} else {

				if (sortBase == "YearOfWork") {
					data.sort(function (a, b) {

						if (a.YearOfWork < b.YearOfWork) {

							return -1;
						} else {
							if (a.YearOfWork > b.YearOfWork) {

								return 1;
							} else {
								return 0;
							}
						}

					});
				}
			}
		}
	}
	
	//adding components of paintings list, which executes upon invokation of main program processPaintingsInfo function below
	function addPaintingList(data) {
		let i = 0;
		for (let d of data) {
			//add image, aritst, title and year accordingly
			let option = document.createElement("li");
			const imgLink = `https://res.cloudinary.com/funwebdev/image/upload/w_75/art/paintings/square/${d.ImageFileName}`;
			const imgP = document.createElement("img");
			imgP.setAttribute("src", imgLink);
			option.appendChild(imgP);
			document.querySelector("#paintingsList").appendChild(option);
			option = document.createElement("li");
			option.textContent = d.LastName;
			option.setAttribute("id", `artist${i}`);
			document.querySelector("#artistList").appendChild(option);
			option = document.createElement("li");
			const titleNameLink = document.createElement("a");
			titleNameLink.setAttribute("href", "#");
			option.textContent = d.Title;
			titleNameLink.appendChild(option);
			option.setAttribute("id", i);
			document.querySelector("#titleList").appendChild(titleNameLink);
			option = document.createElement("li");
			option.textContent = d.YearOfWork;
			document.querySelector("#yearList").appendChild(option);
			i++;

		}
	}
	
	//occurs when processPaintingsInfo function in main program is invoked
	function reInitializePaintingList() {
		//re-initializations commence
		document.querySelector("#paintingsList").style.listStyle = "none";
		document.querySelector("#artistList").style.listStyle = "none";
		document.querySelector("#titleList").style.listStyle = "none";
		document.querySelector("#yearList").style.listStyle = "none";
		document.querySelector("#paintingsList").innerHTML = "";
		document.querySelector("#artistList").innerHTML = "";
		document.querySelector("#titleList").innerHTML = "";
		document.querySelector("#yearList").innerHTML = "";

	}

	function organizeSinglePageDiv() {
		//remove gallery show/hide button for single painting page view
		document.querySelector(".galleryButton").style.display = "none";
		//retrieve gallery id, by analyzing the paintings class, which is dynamically re-assigned this value upon gallery selection
		//re-initializations commence
		document.querySelector(".galleryInformation").style.display = "none";
		document.querySelector(".galleries").style.display = "none";
		document.querySelector(".paintings").style.display = "none";
		document.querySelector("#map").style.display = "none";
		//single page div design commences
		const singlePageDiv = document.createElement("div");
		singlePageDiv.className = "box singlePage";
		document.querySelector(".h").insertAdjacentElement('afterend', singlePageDiv);
		singlePageDiv.style.gridRow = "2/4";
		singlePageDiv.style.gridColumn = "1/4";
		singlePageDiv.style.display = "grid";
		singlePageDiv.style.gridTemplateColumns = "auto 60%";
		singlePageDiv.style.gridTemplateRows = "100px auto 200px 100px";
		//painting div generated
		const imageD = document.createElement("div");
		imageD.classList.add("imageDiv");
		singlePageDiv.appendChild(imageD);
		imageD.style.gridColumn = "1/2";
		imageD.style.gridRow = "1/5";
	
	}


	function processImage(d) {
		paintingSrc = `https://res.cloudinary.com/funwebdev/image/upload/w_600/art/paintings/${d.ImageFileName}`;
		const singlePageImageView = document.createElement("img");
		singlePageImageView.setAttribute("src", paintingSrc);
		singlePageImageView.setAttribute("alt", d.Title);
		singlePageImageView.classList.add("imageView");
		singlePageImageView.setAttribute("id", getIDFromClass(document.querySelector(".paintings").className));
		document.querySelector(".imageDiv").appendChild(singlePageImageView);
	
	}

	function processTitle(d) {
		const pTitleHeader = document.createElement("h2");
		pTitleHeader.style.gridColumn = "2/3";
		pTitleHeader.style.gridRow = "1/2";
		pTitleHeader.textContent = d.Title;
		pTitleHeader.classList.add('pTitleHeader');
		document.querySelector(".singlePage").appendChild(pTitleHeader);
	
	}

	function processParagraphInfo(d) {
		const aMuseum = document.createElement("a");
		aMuseum.setAttribute("href", d.MuseumLink);
		aMuseum.textContent = d.MuseumLink;
		const pInfo = document.createTextNode(`Year: ${d.YearOfWork}, Medium: ${d.Medium}, Width: ${d.Width}, Height: ${d.Height}, CopyRight: ${d.CopyrightText}, Gallery Name: ${d.GalleryName}, Gallery City: ${d.GalleryCity}, Museum Link: `);
		//painting info paragraph initialized and processed.
		let pPara = document.createElement("p");
		pPara.classList.add("paintingParagraph");
		pPara.appendChild(pInfo);
		pPara.appendChild(aMuseum);
		if (d.Description != null) {
			const pInfo2 = document.createTextNode(`, Decription: ${d.Description}`);
			pPara.appendChild(pInfo2);
		}
		document.querySelector(".pTitleHeader").insertAdjacentElement("afterend", pPara);
		document.querySelector(".pTitleHeader").style.marginRight = "90px";
		document.querySelector(".singlePage").appendChild(pPara);
		pPara.style.gridColumn = "2/3";
		pPara.style.gridRow = "2/3";
	
	}

	function addColorTitle() {
		//colors paragraph outlined
		const colorTitle = document.createElement("p");
		document.querySelector(".paintingParagraph").insertAdjacentElement("afterend", colorTitle);
		document.querySelector(".paintingParagraph").style.margin = "28px";
		colorTitle.style.gridColumn = "2/3";
		colorTitle.style.gridRow = "3/4";
		colorTitle.textContent = "Colors";
		colorTitle.style.textAlign = "center";
		colorTitle.style.marginLeft = "49px";
		colorTitle.style.fontStyle = "oblique";
		colorTitle.style.marginRight = "90px";
		colorTitle.classList.add("cTitle");
	
	}

	function addColorsDiv() {
		let colorDiv = document.createElement("div");
		colorDiv.classList.add("colorDivBox");
		document.querySelector(".cTitle").insertAdjacentElement("afterend", colorDiv);
		colorDiv.style.marginLeft = "97px";
		colorDiv.style.gridColumn = "2/3";
		colorDiv.style.gridRow = "3/4";
		document.querySelector(".colorDivBox").style.display = "inline-grid";
		document.querySelector(".colorDivBox").style.gridTemplateColumns = "16.66% 16.66% 16.66% 16.66% 16.66% 16.66%";
		document.querySelector(".colorDivBox").style.gridTemplateRows = "auto"
	
	}

	function organizeColors(d) {
		//outlining r, g and b variables for each painting.
		let r;
		let g;
		let b;
		//outlining colors to process rgb, hex and name for painting
		let colorsRGB = [];
		let colorHex = [];
		let colorName = [];
		for (let i = 0; i < d.JsonAnnotations.dominantColors.length; i++) {
			colorHex[i] = d.JsonAnnotations.dominantColors[i].web;
			colorName[i] = d.JsonAnnotations.dominantColors[i].name;
			r = d.JsonAnnotations.dominantColors[i].color.red;
			g = d.JsonAnnotations.dominantColors[i].color.green;
			b = d.JsonAnnotations.dominantColors[i].color.blue;


			colorsRGB[i] = {
				"r": r,
				"g": g,
				"b": b
			};

		}
		//processing data retrieved into div to display
		for (let i = 0; i < 5; i++) {

			const individualColorDiv = document.createElement("div");
			individualColorDiv.style.gridColumn = `${i+1}/${i+1}`;
			individualColorDiv.title = `${colorName[i]} ${colorHex[i]}`;
			individualColorDiv.style.gridRow = "2/3";
			individualColorDiv.style.backgroundColor = `rgb(${colorsRGB[i].r},${colorsRGB[i].g},${colorsRGB[i].b})`;
			document.querySelector(".colorDivBox").appendChild(individualColorDiv);

		}
	}

	function createCloseBtn() {
		//creating the close button 
		const btn = document.createElement("button");
		btn.classList.add("closeBtn");
		const c = document.createTextNode("Close");
		btn.appendChild(c);
		document.querySelector(".colorDivBox").insertAdjacentElement("afterend", btn);
		btn.style.width = "10.8rem";
		document.querySelector(".singlePage").appendChild(btn);
		btn.style.fontStyle = "oblique";
		btn.style.gridColumn = "2/3";
		btn.style.gridRow = "4/5";
		btn.style.margin = "5% 0% 0% 39%";
		btn.style.backgroundColor = "lightgray";
		btn.style.borderRadius = "5px";
		btn.style.borderColor = "white";
		btn.style.borderWidth = "2px";
		btn.style.height = "50%";
	
	}

	function clostBtnProcess() {
		document.querySelector(".singlePage").style.display = "none";
		document.querySelector(".singlePage").classList.remove("singlePage");
		document.querySelector(".galleryInformation").style.display = "block";
		document.querySelector(".galleries").style.removeProperty("display");
		document.querySelector(".paintings").style.removeProperty("display");
		document.querySelector("#map").style.removeProperty("display");
		//function invoked to bring back original gallery/painting listing page.
		document.querySelector(".galleryButton").className = "galleryButton showGallery";
		displayRegView();
		//revoke the display none assigned to the gallery show/hide button, which was done for the single painting page view.
		document.querySelector(".galleryButton").style.display = "";

	}

	function processSinglePageView(data, e) {
		for (let d of data) {
			//Ensuring both title and artist match, before including painting, which is retrieved from the id of the artist (assigned when artists were set) as well as the title name
			if (e.target.textContent == d.Title && document.getElementById(`artist${e.target.getAttribute("id")}`).textContent == d.LastName) {
				processImage(d);
				//information for respective painitng.
				processTitle(d);
				document.querySelector(".pTitleHeader").style.marginLeft = "80px";
				processParagraphInfo(d);
				addColorTitle();
				addColorsDiv();
				organizeColors(d);
				createCloseBtn();

				//closing of single page painting view
				document.querySelector(".closeBtn").addEventListener("click", function () {
					clostBtnProcess();
				});

				//invoke the event listener and function for displaying the large image upon clicking of image in single painting view
				document.querySelector(".imageView").addEventListener("click", function () {

					imageClicked(document.querySelector(".singlePage"), e);

				});

			}
		}
	}

	function processClickToCloseLightBox() {
		const clickToClose = document.createElement("h3");
		clickToClose.classList.add("clickToClose");
		clickToClose.textContent = "Click Painting to Exit LightBox";
		clickToClose.style.fonstStyle = "oblique";
		clickToClose.style.color = "darkRed";
		clickToClose.style.fontSize = "75%";
		document.querySelector("h1+h2").appendChild(clickToClose);
	
	}

	function processLargeImageDisplay(paintingSrcChg) {
		let paintingSrcChanged = paintingSrcChg.join("/");
		//retrieve required data from the previous sized image
		const largeImageAlt = document.querySelector(".imageView").getAttribute("alt");
		const pId = document.querySelector(".imageView").getAttribute("id");
		//hide the current single painting view
		document.querySelector(".singlePage").style.display = "none";
		//re-generate large painting page
		let singlePageDiv = document.createElement("div");
		singlePageDiv.style.width = "80rem";
		singlePageDiv.style.height = "1300px";
		document.querySelector(".h").insertAdjacentElement("afterend", singlePageDiv);
		singlePageDiv.classList.add("largeImageView");
		singlePageDiv.style.marginLeft = "230px";
		document.querySelector(".imageView").setAttribute("src", paintingSrcChanged);
		document.querySelector(".imageView").setAttribute("alt", largeImageAlt);
		document.querySelector(".imageView").setAttribute("id", pId);
		document.querySelector(".imageView").style.marginTop = "75px";
		singlePageDiv.appendChild(document.querySelector(".imageView"));
		document.querySelector(".imageView").style.margin = "35px 0 0 165px";
		processClickToCloseLightBox();

	}

	function processLightBox(paintingSrcChg) {
		for (let ps = 0; ps < paintingSrcChg.length; ps++) {
			if (paintingSrcChg[ps] == "w_600") {
				paintingSrcChg.splice(ps, 1, "w_700");
			}

		}

		processLargeImageDisplay(paintingSrcChg);

	}


	function revertToSinglePageView(paintingSrc) {
		//revert back to regular single painting view, based on size of w_xxx in src of image being w_700.
		let paintingSrcChg = paintingSrc.split("/");
		if (paintingSrcChg[6] == "w_700") {

			for (let ps = 0; ps < paintingSrcChg.length; ps++) {
				if (paintingSrcChg[ps] == "w_700") {
					paintingSrcChg.splice(ps, 1, "w_600");
				}
			}

		}
		document.querySelector(".clickToClose").remove();
		// remove large painting page display.
		document.querySelector(".largeImageView").remove();
		//revert to regular single painting page view.
		document.querySelector(".singlePage").style.display = "grid";
		const regSizedPainting = document.createElement("img");
		regSizedPainting.classList.add("imageView");
		regSizedPainting.setAttribute("src", paintingSrcChg.join("/"));
		document.querySelector(".imageDiv").appendChild(regSizedPainting);
		//if clicked again, re-process by invoking current function.
		regSizedPainting.addEventListener("click", function (e) {
			imageClicked(document.querySelector(".singlePage"), e);


		});
	}


	// Main Program

	makeButton();
	//event triggered upon clicking of above defined button
	document.querySelector(".showGallery").addEventListener('click', toggleGalleryList);
	//initiating gallery list showing
	document.querySelector("#galleryList").style.listStyle = "none";
	//adding loading gif
	const imgGif = document.createElement("img");
	imgGif.setAttribute("src", "images/loadingGif.gif");
	imgGif.setAttribute("alt", "Loading");
	document.querySelector("#galleryList").appendChild(imgGif);
	//fetching and assigning data in API to array, for further processing, as required.
	fetch(galleryURL).then(response => response.json()).then(data => {
		addGalleryList(data);

	}).catch(error => {
		console.error(error)
	});
	//initiating process of gallery list selection, by way of clicking.
	document.querySelector("#galleryInfo").style.listStyle = "none";
	document.querySelector("#galleryList").addEventListener('click', function (e) {

		processGallerySelection(e);

	});
	//process header click on painting list
	const paintingH2 = document.querySelectorAll("div>h2");
	addHeaderClickListeners(paintingH2);
	function processPaintingsInfo(id, sortBase) {
		//display loading gif while data is retrieved
		document.querySelector("#title h2").innerHTML = "";
		document.querySelector("#title h2").appendChild(imgGif);
		const paintingInfoURL = getPaintingInfoURL(id);
		reInitializePaintingList();
		//fetch and sort data
		fetch(paintingInfoURL).then(response => response.json()).then(data => {
			sortData(sortBase, data);
			//remove loading gif, by re-adding Title header
			document.querySelector("#title h2").textContent = "Title";
			//add painting items
			addPaintingList(data);

		}).catch(error => {
			console.error(error)
		});
	}
	//process event listener for generating single painting view upon selection of work
	document.querySelector("#titleList").addEventListener('click', function (e) {
		organizeSinglePageDiv();
		const pURL = getPaintingInfoURL(getIDFromClass(document.querySelector(".paintings").className));
		//initializing variable to store src attribute of painting
		let painitngSrc;
		fetch(pURL).then(response => response.json()).then(data => {

			processSinglePageView(data, e);

		}).catch(error => {
			console.error(error)
		});

	});
	//process dsiplay upon click of image, whereby the w_xxx in the src of image is the factor outlining whether single painting view or large painting view should be displayed
	function imageClicked(singlePageDiv, e) {
		const largeImage = document.querySelector("img");
		largeImage.classList.add("imageView");
		let paintingSrc = largeImage.getAttribute("src");
		let paintingSrcChg = paintingSrc.split("/");
		//if the size of the painitng (w_600) indicates that the current display is regular single painting, based on the src variable, replace the size of the painting in the src attribute
		if (paintingSrcChg[6] == "w_600") {

			processLightBox(paintingSrcChg);
			
		} else {
			
			revertToSinglePageView(paintingSrc);

		}
	}

	function initMap() {
		map = new google.maps.Map(document.getElementById('map'), {
			center: {
				lat: clat,
				lng: clng
			},
			zoom: 18
		});

	}

});
