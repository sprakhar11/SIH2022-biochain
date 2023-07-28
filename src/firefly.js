import axios from 'axios';
export class FireFly {
    constructor(host) {
        this.ns = 'default';
        this.rest = axios.create({ baseURL: `${host}/api/v1` });
    }
    async sendBroadcast(data) {
        await this.rest.post(`/namespaces/${this.ns}/messages/broadcast`, { data });
    }
    async sendPrivate(privateMessage) {
        await this.rest.post(`/namespaces/${this.ns}/messages/private`, privateMessage);
    }
    async getMessages(limit) {
        const response = await this.rest.get(`/namespaces/${this.ns}/messages?limit=${limit}&type=private&type=broadcast`);
        return response.data;
    }
    async getStatus() {
        const response = await this.rest.get(`/status`);
        return response.data;
    }
    async getOrgs() {
        const response = await this.rest.get(`/network/organizations`);
        return response.data;
    }
    retrieveData(data) {
        return Promise.all(data.map((d) => this.rest
            .get(`/namespaces/${this.ns}/data/${d.id}`)
            .then((response) => response.data)));
    }
}
