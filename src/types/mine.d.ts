
declare namespace MineAPI {
  interface ICategoryList {
    id: number;
    helpCategoryName: string;
    outRangId: number;
    available: number;
    creater: string;
    createTime: string;
    updater?: any;
    updateTime?: any;
    isdelete: number;
    picPath?: any;
    categoryDetail: ICategoryDetail[];
  }

  interface OprHelpContentList {
    id: number;
    helpContent: string;
    contentTitle: string;
    helpCategoryId: number;
    helpTitleId: number;
    creater: string;
    createTime: string;
    updater?: any;
    updateTime?: any;
    isdelete: number;
  }

  interface ICategoryDetail {
    id: number;
    titleName: string;
    helpCategoryId: number;
    creater: string;
    createTime: string;
    updater?: any;
    updateTime?: any;
    isdelete: number;
    oprHelpContentList: OprHelpContentList[];
  }
}