class Applications {
	constructor() {
		this.lastId = 0;
		this.all = [];
		this.byId = {};
	}

	findAll() {
		return this.all.map(id => this.byId[id]);
	}

	findById(id) {
		return this.byId[+id];
	}

	findOneByKyccId(id) {
		return this.findAll().find(itm => itm.applicationId === id);
	}

	upsertFromKycc(update) {
		let localApplication = this.findOneByKyccId(update.applicationId);

		if (!localApplication) {
			localApplication = this.create(update);
		} else {
			localApplication = this.updateById(update, localApplication.id);
		}
	}

	updateById(data, id) {
		if (!this.byId[id]) {
			return null;
		}
		this.byId[id] = {
			...this.byId[id],
			...data,
			id,
			updatedAt: Date.now(),
			createdAt: this.byId[id].createdAt
		};
		return this.byId[id];
	}

	create(data) {
		const id = ++this.lastId;
		this.all.push(id);
		this.byId[id] = {...data, id, createdAt: Date.now(), updatedAt: null};
		return this.byId[id];
	}
}

module.exports = new Applications();
