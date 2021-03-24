
export default interface ILevel {
    _id?: number;
    concept: boolean;
    alternateDrilldown?: boolean;
    color: string;
    level: number;
    count: number;
    fullName: string;
    name: string;
    shade: string;
    children?: ILevel[];
}