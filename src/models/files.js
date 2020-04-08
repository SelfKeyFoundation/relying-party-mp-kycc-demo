class Files {
	constructor() {
		this.lastId = 0;
		this.all = [];
		this.byId = {};
	}

	findAll() {
		return this.all.map(id => this.byId[id]);
	}

	upsertFromKycc(file, id, mimeType = 'application/octet-stream') {
		let localFile = this.findOneByKyccId(id);
		if (localFile) {
			localFile.content = file;
			localFile.mimeType = mimeType;
		} else {
			localFile = this.create({
				kyccId: id,
				content: file,
				mimeType
			});
		}
		return localFile;
	}

	findById(id) {
		return this.byId[id];
	}

	findOneByKyccId(id) {
		return this.findAll().find(itm => itm.kyccId === id);
	}

	create(data) {
		const id = ++this.lastId;
		this.all.push(id);
		this.byId[id] = {...data, id};
		return this.byId[id];
	}
}

module.exports = new Files();
