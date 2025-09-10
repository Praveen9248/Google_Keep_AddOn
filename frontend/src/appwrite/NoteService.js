import conf from "../configurations/conf.js";
import { Client, ID, Databases, Storage, Query, Functions } from "appwrite";
import authService from "./AuthService.js";

export class Service {
  client = new Client();
  databases;
  storage;
  functions;
  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.databases = new Databases(this.client);
    this.storage = new Storage(this.client);
    this.functions = new Functions(this.client);
  }

  async createNote(data) {
    try {
      const user = await authService.getCurrentUser();
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        ID.unique(),
        {
          ...data,
          userId: user.$id,
        }
      );
    } catch (error) {
      throw error;
    }
  }

  async updateNote(data, noteId) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        noteId,
        data
      );
    } catch (error) {
      throw error;
    }
  }

  async deleteNote(slug) {
    try {
      return await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      );
    } catch (error) {
      throw error;
    }
  }

  async listNote() {
    try {
      const user = await authService.getCurrentUser();
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        [Query.equal("userId", user.$id)]
      );
    } catch (error) {
      throw error;
    }
  }

  async getNote(slug) {
    try {
      return await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      );
    } catch (error) {
      throw error;
    }
  }

  async uploadFile(file) {
    try {
      // console.log(file);
      return await this.storage.createFile(
        conf.appwriteBucketId,
        ID.unique(),
        file
      );
    } catch (error) {
      throw error;
    }
  }

  fileUrl(fileId) {
    try {
      return this.storage.getFileView(conf.appwriteBucketId, fileId);
    } catch (error) {
      console.log(error);
    }
  }

  async deleteFile(fileId) {
    try {
      return await this.storage.deleteFile(conf.appwriteBucketId, fileId);
    } catch (error) {
      throw error;
    }
  }

  async updateFile(fileId, file) {
    try {
      return await this.storage.updateFile(conf.appwriteBucketId, fileId, file);
    } catch (error) {
      throw error;
    }
  }

  async analyzeNote(noteId) {
    try {
      const response = await this.functions.createExecution(
        conf.appwriteFunctionId,
        JSON.stringify({ noteId, style: "concise" })
      );
      const data = JSON.parse(response.responseBody);
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  async searchNote(searchText) {
    try {
      const user = await authService.getCurrentUser();
      const res = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        [Query.equal("userId", user.$id), Query.search("title", searchText)]
      );
      return res.documents;
    } catch (error) {
      console.error(error);
    }
  }
}

const service = new Service();

export default service;
