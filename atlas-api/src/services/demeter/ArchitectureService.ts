/* eslint-disable max-len */
import { Neo4JAccessLayer } from "@database/Neo4jAccessLayer";
import ArchitectureNode from "@entities/Imaging/ArchitectureNode";
import Archimodel from "@interfaces/imaging/ArchiModel";
import Subset from "@interfaces/imaging/Subset";
import { logger } from "@shared/Logger";
import { QueryResult, Node } from "neo4j-driver";

export default class ArchitectureService {
  private static NEO4JAL: Neo4JAccessLayer = Neo4JAccessLayer.getInstance();

  /**
   * Get the Hidden label of the architecture nodes
   * @return {Promise<string>} A promise returning the label
   */
  public static async getHiddenArchitectureLabel(): Promise<string> {
    try {
      const req = `CALL demeter.get.architecture.hidden.label()`;
      const res: QueryResult = await ArchitectureService.NEO4JAL.execute(req);
      if (!res || res.records.length == 0)
        throw new Error("Failed to retrieve the hidden Architecture label");
      return String(res.records[0].get(0));
    } catch (err) {
      logger.error(`Failed to get hidden architecture label.`, err);
      throw err;
    }
  }

  /**
   * Get the Hidden label of the subset nodes
   * @return {Promise<string>} A promise returning the label
   */
  public static async getHiddenSubsetLabel(): Promise<string> {
    try {
      const req = `CALL demeter.get.subset.hidden.label()`;
      const res: QueryResult = await ArchitectureService.NEO4JAL.execute(req);
      if (!res || res.records.length == 0)
        throw new Error("Failed to retrieve the hidden Subset label");
      return String(res.records[0].get(0));
    } catch (err) {
      logger.error(`Failed to get hidden subset label.`, err);
      throw err;
    }
  }


  /**
   * Update an architecture view using its id
   * @param {number} architectureId Id of the architecture view
   * @param {Archimodel} data new data for the architecture model
   */
  public async updateArchitectureByID(architectureId: number, data: Archimodel) {
    try {
      const label = await ArchitectureService.getHiddenArchitectureLabel();
      const params: any  = data;
      params.idArchiModel = architectureId;
      
      const req = `MATCH (a) WHERE (a:ArchiModel OR a:${label}) AND ID(a)=$idArchiModel
      SET a.Name=$name
      SET a.Color=$color
      return a as node;
      `
      const res: QueryResult = await ArchitectureService.NEO4JAL.executeWithParameters(req, params);
      if (!res || res.records.length == 0)
        throw new Error(`Failed to update the architecture with id ${architectureId}.`);

    } catch (err) {
      logger.error(`Failed to update the architecture with id ${architectureId}.`, err);
      throw err;
    }
  }

  /**
   * Update a subset using its id
   * @param {number} subsetID Id of the architecture view
   * @param {Subset} data new data for the architecture model
   */
   public async updateSubsetByID(subsetID: number, data: Subset) {
    try {
      const label = await ArchitectureService.getHiddenSubsetLabel();
      const params: any  = data;
      params.subsetID = subsetID;
      
      const req = `MATCH (a) WHERE (a:Subset OR a:${label}) AND ID(a)=$subsetID
      WITH a, a.Name as OldName
      SET a.Name=$name
      SET a.Color=$color
      WITH a, OldName
      MATCH (a)-[:Contains]->(o:Object)
      SET o.Subset = [ x in o.Subset WHERE NOT x=a.Name ] + OldName
      return a as node
      `
      const res: QueryResult = await ArchitectureService.NEO4JAL.executeWithParameters(req, params);
      if (!res || res.records.length == 0)
        throw new Error(`Failed to update the subsetID with id ${subsetID}.`);

    } catch (err) {
      logger.error(`Failed to update the architecture with id ${subsetID}.`, err);
      throw err;
    }
  }


  /**
   * Delete an Architecture using its Id
   * @param {string} application Name of the application
   * @param {number} architectureId Id of the architecture
   * @returns
   */
  public async deleteArchitectureByID(
    application: string,
    architectureId: number
  ): Promise<void> {
    try {
      const req = `CALL demeter.delete.architecture.view($application, $id)`;
      await ArchitectureService.NEO4JAL.executeWithParameters(req, {
        application: application,
        id: architectureId,
      });
    } catch (err) {
      logger.error(
        `Failed to delete architecture with id: '${architectureId}'.`,
        err
      );
      throw err;
    }
  }

  /**
   * Delete an Architecture using its Id
   * @param {string} application Name of the application
   * @param {number} subsetId Id of the subset
   * @returns
   */
  public async deleteSubset(
    application: string,
    subsetId: number
  ): Promise<void> {
    try {
      const req = `CALL demeter.delete.architecture.subset($application, $id)`;
      await ArchitectureService.NEO4JAL.executeWithParameters(req, {
        application: application,
        id: subsetId,
      });
    } catch (err) {
      logger.error(`Failed to get delete subset with id: '${subsetId}'.`, err);
      throw err;
    }
  }

  /**
   * Hide an Architecture using its Id
   * @param {number} architectureId Id of the architecture
   * @return {Promise<void>} Promise ending when
   */
  public async hideArchitectureById(architectureId: number): Promise<void> {
    try {
      const req = `CALL demeter.architecture.hide.byId($id)`;
      await ArchitectureService.NEO4JAL.executeWithParameters(req, {
        id: architectureId,
      });
    } catch (err) {
      logger.error(
        `Failed to get delete architecture with id: '${architectureId}'.`,
        err
      );
      throw err;
    }
  }

  /**
   * Display an Architecture using its Id
   * @param {number} architectureId Id of the architecture
   * @returns
   */
  public async displayArchitectureById(architectureId: number): Promise<void> {
    try {
      const req = `CALL demeter.architecture.display.byId($id)`;
      await ArchitectureService.NEO4JAL.executeWithParameters(req, {
        id: architectureId,
      });
    } catch (err) {
      logger.error(
        `Failed to display architecture with id: '${architectureId}'.`,
        err
      );
      throw err;
    }
  }

  /**
   * Display an Architecture and its children using its Id
   * @param {number} architectureId Id of the architecture
   * @returns
   */
  public async displayCompleteArchitectureById(
    architectureId: number
  ): Promise<void> {
    try {
      const req = `CALL demeter.architecture.display.children.byId($id)`;
      await ArchitectureService.NEO4JAL.executeWithParameters(req, {
        id: architectureId,
      });
    } catch (err) {
      logger.error(
        `Failed to display complete architecture with id: '${architectureId}'.`,
        err
      );
      throw err;
    }
  }

  /**
   * Hide a Subset using its Id
   * @param {number} subsetId Id of the subset
   * @returns
   */
  public async hideSubsetById(subsetId: number): Promise<void> {
    try {
      const req = `CALL demeter.subset.hide.byId($id)`;
      await ArchitectureService.NEO4JAL.executeWithParameters(req, {
        id: subsetId,
      });
    } catch (err) {
      logger.error(`Failed to hide subset with id: '${subsetId}'.`, err);
      throw err;
    }
  }

  /**
   * Display a Subset using its Id
   * @param {number} subsetId Id of the subset
   * @returns
   */
  public async displaySubsetById(subsetId: number): Promise<void> {
    try {
      const req = `CALL demeter.subset.display.byId($id)`;
      await ArchitectureService.NEO4JAL.executeWithParameters(req, {
        id: subsetId,
      });
    } catch (err) {
      logger.error(`Failed to display subset with id: '${subsetId}'.`, err);
      throw err;
    }
  }

  /**
   * Group object in a specific application
   */
  public async executeGroupingInAllApplications(): Promise<number> {
    try {
      const request = `CALL demeter.api.group.architectures.views.all()`;

      const results: QueryResult = await ArchitectureService.NEO4JAL.execute(
        request
      );
      return results.records.length || 0;
    } catch (err) {
      logger.error(`Failed to group the architecture views.`, err);
      throw err;
    }
  }

  /**
   * Get all the architecture in the application
   * @param {string} application Name of the application
   * @return {Promise<Archimodel[]>} Promise returning a list of ArchiModel in the application
   */
  public async getAllArchitectures(application: string): Promise<Archimodel[]> {
    try {
      const hiddenLabel =
        await ArchitectureService.getHiddenArchitectureLabel();
      const req = `MATCH (a:\`${application}\`) WHERE a:ArchiModel or a:${hiddenLabel} RETURN a as node`;

      const archimodel: Archimodel[] = [];
      const res = await ArchitectureService.NEO4JAL.execute(req);

      if (res && res.records.length > 0) {
        for (let index = 0; index < res.records.length; index++) {
          const node: Node = res.records[index].get("node");
          try {
            archimodel.push(await ArchitectureNode.fromObj(node));
          } catch (err) {
            logger.error(
              `Architecture node with id ${node.identity.toNumber()} is not in a correct format.`,
              err
            );
          }
        }
      }

      return archimodel;
    } catch (err) {
      logger.error(
        `Failed to retrieve the list of architecture in application : '${application}'.`,
        err
      );
      throw new Error("Failed to retrieve the list of Architectures");
    }
  }
}
