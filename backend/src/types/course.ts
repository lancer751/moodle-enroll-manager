export interface MoodleCourse {
    id: number;
    shortname: string;
    categoryid: number;
    categorysortorder: number;
    fullname: string;
    displayname: string;
    idnumber: string;
    summary: string;
    summaryformat: number;
    format: string;
    showgrades: number;
    newsitems: number;
    startdate: number;
    enddate: number;
    numsections: number;
    maxbytes: number;
    showreports: number;
    visible: number;
    hiddensections: number;
    groupmode: number;
    groupmodeforce: number;
    defaultgroupingid: number;
    timecreated: number;
    timemodified: number;
    enablecompletion: number;
    completionnotify: number;
    lang: string;
    forcetheme: string;
    courseformatoptions: {
        name: string;
        value: number | string;
    }[];
}

export interface RawCourseMoodle {
    id: number;
    categoryid: number;
    description: string;
    name: string;
    startdate: Date;
    enddate: Date;
    timecreated: Date;
    numsections: number;
}
