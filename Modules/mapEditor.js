function editor() {
	this.locationId = 0;
	this.nameTag = new nameTag("newMap", "mapTag");
	this.mapSize = new Vector2();
	this.mapPosInit = new Vector2();
	this.playerPosInit = new Vector2();
	this.tileSize = new Vector2();
	this.tiles = [];
	
	this.oldNameTag = new nameTag("newMap", "mapTag");
	this.oldTileSize = new Vector2(32, 32);
	this.gridNameTag = new nameTag("gridTile", "grid");
	this.gridSize = new Vector2();
	this.thisGridTile = null;
	this.currentGridTile = null;
	this.oldCurrentTileNumber = -1;
	this.currentTileNumber = 0;
	this.thisTile = [];
	this.currentTile = null;
	this.reload = false;
	this.placeLatch = false;
	this.deleteLatch = false;
	this.currentLayer = 1;
	this.currentTileTableNumber = 1;
	this.currentTileTable = null;
	this.currentTileTableName = null;
	
	let thisMap = null;
	let oldMapPos = new Vector2();
	let movingGrid = false;
	
	Cursor.cursor.base.size = new Vector2(1, 1);
	
	let gridTiles = [];
	let oldLength = 0;
	let stopHide = false;
	
	//Gets map as a string
	this.getTrueMap = function() {
	return "new map("+this.locationId+", new nameTag('"+this.nameTag.name+"', '"+this.nameTag.tag+"'), new Vector2("+this.mapSize.x+", "+this.mapSize.y+"), new Vector2("+this.mapPosInit.x+", "+this.mapPosInit.y+"), new Vector2("+this.playerPosInit.x+", "+this.playerPosInit.y+"), new Vector2("+this.tileSize.x+", "+this.tileSize.y+"), "+JSON.stringify(this.tiles).replace("'", "")+");";
	}
	
	//Save map
	this.saveMap = function() {
		localStorage.setItem(this.nameTag.name, JSON.stringify(thisMap));
		localStorage.setItem(this.nameTag.name+"_tile_data", JSON.stringify(this.tiles));
	}
	
	//Load map
	this.loadMap = function() {
		let data = JSON.parse(localStorage.getItem(this.nameTag.name));
		let data_tiles = JSON.parse(localStorage.getItem(this.nameTag.name+"_tile_data"));
		this.idTxtBox.value = String(data.locationId);
		this.nameTxtBox.value = String(data.nameTag.name);
		this.sizeXTxtBox.value = String(data.mapSize.x);
		this.sizeYTxtBox.value = String(data.mapSize.y);
		this.startPosXTxtBox.value = String(data.mapPosInit.x);
		this.startPosYTxtBox.value = String(data.mapPosInit.y);
		this.playerPosXTxtBox.value = String(data.playerPosInit.x);
		this.playerPosYTxtBox.value = String(data.playerPosInit.y);
		this.tileSizeXTxtBox.value = String(data.tileSize.x);
		this.tileSizeYTxtBox.value = String(data.tileSize.y);
		this.tiles = data.tiles;
	}
	
	//UI
	this.panel = new Rectangle(8, new baseObject(false, new nameTag("editorPanel", "editor"), new Vector2(400, 720), new Vector2(1080, 360), new colorData("lightgrey", 1)));
	this.nameTxt = new Text(8, "Name:", new baseObject(false, new nameTag("nameTxt", "editor"), new Vector2("30px Arial", false, "left"), new Vector2(940, 50), new colorData("white"), new Shadow(new Vector2(2, 2), "black", 10)));
	this.nameTxtBox = new TextBox(8, "30px Arial", "white", new baseObject(false, new nameTag("nameTxtBox", "editor"), new Vector2(100, 50), new Vector2(1085, 50), new colorData("black", 1)));
	this.nameTxtBox.value = "newMap";
	this.idTxt = new Text(8, "Id:", new baseObject(false, new nameTag("idTxt", "editor"), new Vector2("30px Arial", false, "left"), new Vector2(940, 120), new colorData("white"), new Shadow(new Vector2(2, 2), "black", 10)));
	this.idTxtBox = new TextBox(8, "30px Arial", "white", new baseObject(false, new nameTag("idTxtBox", "editor"), new Vector2(50, 50), new Vector2(1005, 120), new colorData("black", 1)));
	this.idTxtBox.value = "0";
	this.sizeXTxt = new Text(8, "Size: X-", new baseObject(false, new nameTag("sizeXTxt", "editor"), new Vector2("30px Arial", false, "left"), new Vector2(940, 190), new colorData("white"), new Shadow(new Vector2(2, 2), "black", 10)));
	this.sizeXTxtBox = new TextBox(8, "30px Arial", "white", new baseObject(false, new nameTag("sizeXTxtBox", "editor"), new Vector2(50, 50), new Vector2(1075, 190), new colorData("black", 1)));
	this.sizeXTxtBox.value = "0";
	this.sizeYTxt = new Text(8, "Y-", new baseObject(false, new nameTag("sizeYTxt", "editor"), new Vector2("30px Arial", false, "left"), new Vector2(1110, 190), new colorData("white"), new Shadow(new Vector2(2, 2), "black", 10)));
	this.sizeYTxtBox = new TextBox(8, "30px Arial", "white", new baseObject(false, new nameTag("sizeYTxtBox", "editor"), new Vector2(50, 50), new Vector2(1167, 190), new colorData("black", 1)));
	this.sizeYTxtBox.value = "0";
	this.startPosXTxt = new Text(8, "Start: X-", new baseObject(false, new nameTag("startPosXTxt", "editor"), new Vector2("30px Arial", false, "left"), new Vector2(940, 260), new colorData("white"), new Shadow(new Vector2(2, 2), "black", 10)));
	this.startPosXTxtBox = new TextBox(8, "30px Arial", "white", new baseObject(false, new nameTag("startPosXTxtBox", "editor"), new Vector2(50, 50), new Vector2(1080, 260), new colorData("black", 1)));
	this.startPosXTxtBox.value = "0";
	this.startPosYTxt = new Text(8, "Y-", new baseObject(false, new nameTag("startPosYTxt", "editor"), new Vector2("30px Arial", false, "left"), new Vector2(1110, 260), new colorData("white"), new Shadow(new Vector2(2, 2), "black", 10)));
	this.startPosYTxtBox = new TextBox(8, "30px Arial", "white", new baseObject(false, new nameTag("startPosYTxtBox", "editor"), new Vector2(50, 50), new Vector2(1167, 260), new colorData("black", 1)));
	this.startPosYTxtBox.value = "0";
	this.playerPosXTxt = new Text(8, "Player: X-", new baseObject(false, new nameTag("playerPosXTxt", "editor"), new Vector2("30px Arial", false, "left"), new Vector2(940, 330), new colorData("white"), new Shadow(new Vector2(2, 2), "black", 10)));
	this.playerPosXTxtBox = new TextBox(8, "30px Arial", "white", new baseObject(false, new nameTag("playerPosXTxtBox", "editor"), new Vector2(50, 50), new Vector2(1100, 330), new colorData("black", 1)));
	this.playerPosXTxtBox.value = "0";
	this.playerPosYTxt = new Text(8, "Y-", new baseObject(false, new nameTag("playerPosYTxt", "editor"), new Vector2("30px Arial", false, "left"), new Vector2(1130, 330), new colorData("white"), new Shadow(new Vector2(2, 2), "black", 10)));
	this.playerPosYTxtBox = new TextBox(8, "30px Arial", "white", new baseObject(false, new nameTag("playerPosYTxtBox", "editor"), new Vector2(50, 50), new Vector2(1190, 330), new colorData("black", 1)));
	this.playerPosYTxtBox.value = "0";
	this.tileSizeXTxt = new Text(8, "Tile: X-", new baseObject(false, new nameTag("tileSizeXTxt", "editor"), new Vector2("30px Arial", false, "left"), new Vector2(940, 400), new colorData("white"), new Shadow(new Vector2(2, 2), "black", 10)));
	this.tileSizeXTxtBox = new TextBox(8, "30px Arial", "white", new baseObject(false, new nameTag("tileSizeXTxtBox", "editor"), new Vector2(50, 50), new Vector2(1065, 400), new colorData("black", 1)));
	this.tileSizeXTxtBox.value = "32";
	this.tileSizeYTxt = new Text(8, "Y-", new baseObject(false, new nameTag("tileSizeYTxt", "editor"), new Vector2("30px Arial", false, "left"), new Vector2(1100, 400), new colorData("white"), new Shadow(new Vector2(2, 2), "black", 10)));
	this.tileSizeYTxtBox = new TextBox(8, "30px Arial", "white", new baseObject(false, new nameTag("tileSizeYTxtBox", "editor"), new Vector2(50, 50), new Vector2(1160, 400), new colorData("black", 1)));
	this.tileSizeYTxtBox.value = "32";
	this.currentTileTxt = new Text(8, "none", new baseObject(false, new nameTag("currentTileTxt", "editor"), new Vector2("30px Arial", false, "center"), new Vector2(1150, 550), new colorData("white"), new Shadow(new Vector2(2, 2), "black", 10)));
	this.leftBttn = new Rectangle(8, new baseObject(false, new nameTag("leftBttn", "editor"), new Vector2(50, 50), new Vector2(1100, 600), new colorData("grey", 1)));
	this.leftBttnTxt = new Text(8, "<", new baseObject(false, new nameTag("leftBttnTxt", "editor"), new Vector2("30px Arial", false, "center"), new Vector2(1100, 600), new colorData("white"), new Shadow(new Vector2(2, 2), "black", 10)));
	this.leftBttnLink = new buttonLink(this.leftBttn, this.leftBttnTxt, recCollision, () => {
		if (this.currentTileTable != null && this.currentTileNumber > 0) {
			this.currentTileNumber--;
		} else {
			this.currentTileTableNumber--;
			this.currentTileNumber = this.currentTileTable.length;
		}
	}, new Vector2(new colorData("grey"), new colorData("darkgrey")));
	this.rightBttn = new Rectangle(8, new baseObject(false, new nameTag("rightBttn", "editor"), new Vector2(50, 50), new Vector2(1200, 600), new colorData("grey", 1)));
	this.rightBttnTxt = new Text(8, ">", new baseObject(false, new nameTag("rightBttnTxt", "editor"), new Vector2("30px Arial", false, "center"), new Vector2(1200, 600), new colorData("white"), new Shadow(new Vector2(2, 2), "black", 10)));
	this.rightBttnLink = new buttonLink(this.rightBttn, this.rightBttnTxt, recCollision, () => {
		if (this.currentTileTable != null && this.currentTileNumber < this.currentTileTable.length) {
			this.currentTileNumber++;
		} else {
			this.currentTileNumber = 0;
			this.currentTileTableNumber++;
		}
	}, new Vector2(new colorData("grey"), new colorData("darkgrey")));
	this.currentTileNumberTxt = new Text(8, "0", new baseObject(false, new nameTag("currentTileNumberTxt", "editor"), new Vector2("30px Arial", false, "center"), new Vector2(1150, 600), new colorData("white"), new Shadow(new Vector2(2, 2), "black", 10)));
	this.layerTxt = new Text(8, "Layer", new baseObject(false, new nameTag("currentLayerTxt", "editor"), new Vector2("30px Arial", false, "center"), new Vector2(1150, 645), new colorData("white"), new Shadow(new Vector2(2, 2), "black", 10)));
	this.leftLayerBttn = new Rectangle(8, new baseObject(false, new nameTag("leftLayerBttn", "editor"), new Vector2(50, 50), new Vector2(1100, 690), new colorData("grey", 1)));
	this.leftLayerBttnTxt = new Text(8, "<", new baseObject(false, new nameTag("leftLayerBttnTxt", "editor"), new Vector2("30px Arial", false, "center"), new Vector2(1100, 690), new colorData("white"), new Shadow(new Vector2(2, 2), "black", 10)));
	this.leftLayerBttnLink = new buttonLink(this.leftLayerBttn, this.leftLayerBttnTxt, recCollision, () => {
		this.currentLayer--;
	}, new Vector2(new colorData("grey"), new colorData("darkgrey")));
	this.rightLayerBttn = new Rectangle(8, new baseObject(false, new nameTag("rightLayerBttn", "editor"), new Vector2(50, 50), new Vector2(1200, 690), new colorData("grey", 1)));
	this.rightLayerBttnTxt = new Text(8, ">", new baseObject(false, new nameTag("rightLayerBttnTxt", "editor"), new Vector2("30px Arial", false, "center"), new Vector2(1200, 690), new colorData("white"), new Shadow(new Vector2(2, 2), "black", 10)));
	this.rightLayerBttnLink = new buttonLink(this.rightLayerBttn, this.rightLayerBttnTxt, recCollision, () => {
		this.currentLayer++;
	}, new Vector2(new colorData("grey"), new colorData("darkgrey")));
	this.currentLayerTxt = new Text(8, "1", new baseObject(false, new nameTag("currentLayerTxt", "editor"), new Vector2("30px Arial", false, "center"), new Vector2(1150, 690), new colorData("white"), new Shadow(new Vector2(2, 2), "black", 10)));
	
	//Reset map
	this.resetMap = () => {
		if (currentMap() != undefined) {
			oldMapPos = currentMap().mapPos;
			currentMap().dir = new Vector2();
		}
		deleteMap(this.nameTag);
	}
	
	//Tools
	this.fillLatch = false;
	this.fill = function(mapPos=new Vector2(), size=new Vector2()) {
		if (gridTiles != null) {
			for (let x=0;x<size.x;x++) {
				for (let y=0;y<size.y;y++) {
					let thisMapPos = mapPos.duplicate().addV(new Vector2(x, y));
					//this.thisTile = currentMap().getTileByMapPos(thisMapPos, this.currentLayer);
					if (currentMap().getTileByMapPos(thisMapPos, this.currentLayer).length == 0) {
						let newTile = new tile(this.currentTileNumber, thisMapPos.duplicate(), this.currentLayer, this.currentTileTableName);
						this.tiles.push(newTile.duplicate());
						if (x == size.x-1 && y == size.y-1) {
							this.resetMap();
						}
					}
				}
			}
		}
	}
	
	const update = () => {
		if (gameState == 1) {
			//Checks
			if (this.currentTileTableNumber < 1) {
				this.currentTileTableNumber = 1;
			}
			if (this.currentTileTableNumber > config.tileTables.length) {
				this.currentTileTableNumber = config.tileTables.length;
			}
			this.currentTileTableName = config.tileTables[this.currentTileTableNumber-1].funcName;
			this.currentTileTable = eval(this.currentTileTableName);
			locationId = this.locationId;
			if (this.currentTileTable != null) {
				if (this.currentTileNumber > this.currentTileTable.length) {
					this.currentTileNumber = this.currentTileTable.length;
				}
				if (this.currentTileNumber < 0) {
					this.currentTileNumber = 0;
				}
				this.currentTile = this.currentTileTable[this.currentTileNumber];
			}
			if (this.currentLayer > layer.length) {
				this.currentLayer = layer.length;
			}
			if (this.currentLayer <= 0) {
				this.currentLayer = 1;
			}
			//Load UI
			if (getByNameTag(this.panel.base.nameTag) == null) {
				addObject(this.panel);
				addObject(this.nameTxt);
				addObject(this.nameTxtBox);
				addObject(this.idTxt);
				addObject(this.idTxtBox);
				addObject(this.sizeXTxt);
				addObject(this.sizeXTxtBox);
				addObject(this.sizeYTxt);
				addObject(this.sizeYTxtBox);
				addObject(this.startPosXTxt);
				addObject(this.startPosXTxtBox);
				addObject(this.startPosYTxt);
				addObject(this.startPosYTxtBox);
				addObject(this.playerPosXTxt);
				addObject(this.playerPosXTxtBox);
				addObject(this.playerPosYTxt);
				addObject(this.playerPosYTxtBox);
				addObject(this.tileSizeXTxt);
				addObject(this.tileSizeXTxtBox);
				addObject(this.tileSizeYTxt);
				addObject(this.tileSizeYTxtBox);
				addObject(this.currentTileTxt);
				addObject(this.leftBttn);
				addObject(this.leftBttnTxt);
				this.leftBttnLink.link();
				addObject(this.rightBttn);
				addObject(this.rightBttnTxt);
				this.rightBttnLink.link();
				addObject(this.currentTileNumberTxt);
				addObject(this.layerTxt);
				addObject(this.leftLayerBttn);
				addObject(this.leftLayerBttnTxt);
				this.leftLayerBttnLink.link();
				addObject(this.rightLayerBttn);
				addObject(this.rightLayerBttnTxt);
				this.rightLayerBttnLink.link();
				addObject(this.currentLayerTxt);
			}
			//Update UI and Vars
			if (!this.nameTxtBox.isSelected()) {
				this.nameTag.name = this.nameTxtBox.value;
			}
			this.locationId = parseInt(this.idTxtBox.value);
			if (!this.sizeXTxtBox.isSelected() && !this.sizeYTxtBox.isSelected()) {
				this.mapSize = new Vector2(parseInt(this.sizeXTxtBox.value), parseInt(this.sizeYTxtBox.value));
			}
			this.mapPosInit = new Vector2(parseFloat(this.startPosXTxtBox.value), parseFloat(this.startPosYTxtBox.value));
			this.playerPosInit = new Vector2(parseFloat(this.playerPosXTxtBox.value), parseFloat(this.playerPosYTxtBox.value));
			if (!this.tileSizeXTxtBox.isSelected() && !this.tileSizeYTxtBox.isSelected()) {
				this.tileSize = new Vector2(parseFloat(this.tileSizeXTxtBox.value), parseFloat(this.tileSizeYTxtBox.value));
			}
			if (this.currentTile != null) {
				this.currentTileTxt.text = this.currentTile.base.nameTag.name;
			}
			this.currentTileNumberTxt.text = this.currentTileTableNumber+"-"+this.currentTileNumber;
			this.currentLayerTxt.text = this.currentLayer;
			
			if (getMap(this.nameTag) == undefined) {
				maps.length = 0;
				thisMap = new map(this.locationId, this.nameTag, this.mapSize, oldMapPos, this.playerPosInit, this.tileSize, this.tiles);
			}
			
			//Load grid
			if (!this.gridSize.same(this.mapSize) || this.reload) {
				if (this.mapSize.same(ZERO)) {
					this.gridSize = this.mapSize;
				}
				deleteByNameTag(this.nameTag, 0, true);
				deleteByNameTag(this.gridNameTag, 0, true);
				for (let x=1;x<=this.mapSize.x;x++) {
					for (let y=1;y<=this.mapSize.y;y++) {
						let thisPos = new Vector2((x*this.tileSize.x*config.scale)-((this.tileSize.x*config.scale)/2), (y*this.tileSize.y*config.scale)-((this.tileSize.y*config.scale)/2));
						let thisNewPos = thisPos.addV(oldMapPos);
						let gridTile = new Rectangle(8, new baseObject(false, new nameTag(this.gridNameTag.name+"_"+x+"_"+y, this.gridNameTag.tag), this.tileSize.multi(config.scale), thisNewPos, new colorData("grey", 0.25)));
						gridTile.mapPos = new Vector2(x, y);
						gridTile.base.startPosition = thisPos.duplicate();
						layer[8].unshift(gridTile);
						loaded = false;
						if (x == this.mapSize.x && y == this.mapSize.y) {
							gridTiles = getByNameTag(this.gridNameTag, mode=0, false, true);
							this.gridSize = this.mapSize.duplicate();
						}
						if (y >= this.mapSize.y) {
							this.resetMap();
							this.reload = false;
						}
					}
				}
			}
			if (currentMap() != undefined) {
				if (!currentMap().movingMap) {
					//Move Grid
					if (!oldMapPos.same(currentMap().mapPos) || this.reload) {
						for (let i=0,length=gridTiles.length;i<length;i++) {
							let objectBase = gridTiles[i].base;
							movingGrid = true;
							objectBase.position = objectBase.startPosition.addV(currentMap().mapPos);
							if (i == length-1) {
								movingGrid = false;
								oldMapPos = currentMap().mapPos;
							}
						}
					}
					if (!recCollision(Cursor.cursor, this.panel) && !isPaused) {
						//Hover highlight/Place tiles
						if (gridTiles != null) {
							for (let i=0,length=gridTiles.length;i<length;i++) {
								let thisObj = gridTiles[i];
								let objectBase = thisObj.base;
								if (recCollision(Cursor.cursor, thisObj)) {
									objectBase.color.alpha = 0.5;
									this.thisGridTile = thisObj;
									this.thisTile = currentMap().getTileByMapPos(this.thisGridTile.mapPos, this.currentLayer);
									if (mousePressed[0] && !this.placeLatch && this.thisTile.length == 0) {
										this.currentGridTile = this.thisGridTile;
										let newTile = new tile(this.currentTileNumber, this.currentGridTile.mapPos.duplicate(), this.currentLayer, this.currentTileTableName);
										this.tiles.push(newTile.duplicate());
										this.resetMap();
										this.placeLatch = true;
									}
								} else {
									objectBase.color.alpha = 0.25;
								}
							}
						}
						//Delete tiles
						if (this.thisTile.length != 0 && mousePressed[2] && !this.deleteLatch) {
							deleteByNameTag(this.thisTile[0].base.nameTag);
							this.tiles = this.tiles.filter((o) => {
								if (o.pos.same(this.thisTile[0].mapPos) && o.layerNum == this.thisTile[0].layerNumber) {
									return false;
								} else {
									return true;
								}
							});
							this.resetMap();
							this.deleteLatch = true;
						}
					}
					//Unhides the grid after moving the map
					if (stopHide) {
						gridTiles.forEach((o, i) => {
							if (o.base.color.alpha == 0) {
								o.base.color.alpha = 0.25;
							}
							if (i == gridTiles.length-1) {
								stopHide = false;
							}
						});
					}
				} else {
					//Hides the map while moving the grid
					if (!stopHide) {
						gridTiles.forEach((o, i) => {
							if (o.base.color.alpha != 0) {
								o.base.color.alpha = 0;
							}
							if (i == gridTiles.length-1) {
								stopHide = true;
							}
						});
					}
				}
			}
			//Update UI
			let visCurrentTileNameTag = new nameTag("visCurrentTile", "editor");
			if (this.currentTileNumber != this.oldCurrentTileNumber || getByNameTag(visCurrentTileNameTag) == null) {
				if (this.currentTile != null) {
					deleteByNameTag(visCurrentTileNameTag);
					let visCurrentTile = this.currentTile.duplicate();
					visCurrentTile.layerNumber = 8;
					visCurrentTile.base.nameTag = visCurrentTileNameTag;
					visCurrentTile.base.size = new Vector2(64, 64);
					visCurrentTile.base.position = new Vector2(1150, 500);
					addObject(visCurrentTile);
				}
				this.oldCurrentTileNumber = this.currentTileNumber;
			}
			if (!this.oldNameTag.same(this.nameTag)) {
				deleteByNameTag(new nameTag("", this.oldNameTag.name), 2);
				this.resetMap();
				this.oldNameTag = this.nameTag.duplicate();
			}
			if (!this.oldTileSize.same(this.tileSize)) {
				this.reload = true;
				this.oldTileSize = this.tileSize.duplicate();
			}
			if (!mousePressed[0] && this.placeLatch) {
				this.placeLatch = false;
			}
			if (!mousePressed[2] && this.deleteLatch) {
				this.deleteLatch = false;
			}
		} else {
			//Unload UI
			if (getByNameTag(this.panel.base.nameTag) != null) {
				deleteByNameTag(this.currentLayerTxt.base.nameTag);
				this.rightLayerBttnLink.unlink();
				deleteByNameTag(this.rightLayerBttnTxt.base.nameTag);
				deleteByNameTag(this.rightLayerBttn.base.nameTag);
				this.leftLayerBttnLink.unlink();
				deleteByNameTag(this.leftLayerBttnTxt.base.nameTag);
				deleteByNameTag(this.leftLayerBttn.base.nameTag);
				deleteByNameTag(this.layerTxt.base.nameTag);
				deleteByNameTag(this.currentTileNumberTxt.base.nameTag);
				this.rightBttnLink.unlink();
				deleteByNameTag(this.rightBttnTxt.base.nameTag);
				deleteByNameTag(this.rightBttn.base.nameTag);
				this.leftBttnLink.unlink();
				deleteByNameTag(this.leftBttnTxt.base.nameTag);
				deleteByNameTag(this.leftBttn.base.nameTag);
				deleteByNameTag(this.currentTileTxt.base.nameTag);
				deleteByNameTag(this.tileSizeYTxtBox.base.nameTag);
				deleteByNameTag(this.tileSizeYTxt.base.nameTag);
				deleteByNameTag(this.tileSizeXTxtBox.base.nameTag);
				deleteByNameTag(this.tileSizeXTxt.base.nameTag);
				deleteByNameTag(this.playerPosYTxtBox.base.nameTag);
				deleteByNameTag(this.playerPosYTxt.base.nameTag);
				deleteByNameTag(this.playerPosXTxtBox.base.nameTag);
				deleteByNameTag(this.playerPosXTxt.base.nameTag);
				deleteByNameTag(this.startPosYTxtBox.base.nameTag);
				deleteByNameTag(this.startPosYTxt.base.nameTag);
				deleteByNameTag(this.startPosXTxtBox.base.nameTag);
				deleteByNameTag(this.startPosXTxt.base.nameTag);
				deleteByNameTag(this.sizeYTxtBox.base.nameTag);
				deleteByNameTag(this.sizeYTxt.base.nameTag);
				deleteByNameTag(this.sizeXTxtBox.base.nameTag);
				deleteByNameTag(this.sizeXTxt.base.nameTag);
				deleteByNameTag(this.idTxtBox.base.nameTag);
				deleteByNameTag(this.idTxt.base.nameTag);
				deleteByNameTag(this.nameTxtBox.base.nameTag);
				deleteByNameTag(this.nameTxt.base.nameTag);
				deleteByNameTag(this.panel.base.nameTag);
			}
			if (getByNameTag(this.gridNameTag, 0, false, true) != null) {
				this.mapSize = new Vector2();
				this.gridSize = new Vector2();
				layer[8] = [];
			}
		}
	}
	addUpdate(update, "editor");
}