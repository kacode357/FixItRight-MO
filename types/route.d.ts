type RootStackParamList = {
    Home:  undefined;
    Detail: {id : number; title: string; star: number} ;
    MainApp: undefined;
    Login: undefined;
    Register: undefined;
    AllServices: undefined;
    EditScreen: { field: string; value: string }; 
    YourProfile: undefined;
    ProfileMain: undefined;
    CategoryDetails: { categoryId: string }  | undefined;
    ServiceDetails: { serviceId: string };
    PaymentScreen: { userId: string; serviceId: string; price: number };
    PaymentWebView: { paymentUrl: string };
};
