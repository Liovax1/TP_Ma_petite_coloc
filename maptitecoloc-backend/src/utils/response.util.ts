// Pour la gestion des réponses
export class SuccessResponse {
  static simple(data: any) {
    return data;
  }

  static list(data: any[], page?: number, limit?: number, count?: number) {
    return {
      data,
      page,
      limit,
      count
    };
  }
}

export class ErrorResponse {
  static simple(statusCode: number, errorCode: string, errMessage: string) {
    return {
      statusCode,
      errorCode,
      errMessage
    };
  }

  static form(form: string, errorFields: { name: string, errMsg: string }[]) {
    return {
      form,
      errorFields
    };
  }
}
