from rest_framework import permissions

class CustomPermission(permissions.BasePermission):
    """
    Eğer kullanıcı "Admin" veya "Proje Grubu" grubuna dahilse tüm işlemleri yapabilir.
    Eğer değilse, giriş yapmışsa ve SAFE_METHODS (GET, HEAD, OPTIONS) kullanabilir.
    """

    def has_permission(self, request, view):
        # Eğer bir kullanıcı giriş yapmışsa ve "Admin" veya "Proje Grubu" grubunun bir üyesi ise izni ver
        if request.user.is_authenticated:
            return request.user.groups.filter(name__in=['Admin', 'Proje Grubu']).exists()
        
        # Eğer giriş yapmamışsa ve SAFE_METHODS kullanıyorsa izni ver
        if request.method in permissions.SAFE_METHODS:
            return True
        
        return False

    def has_object_permission(self, request, view, obj):
        # Eğer bir kullanıcı giriş yapmışsa ve "Admin" veya "Proje Grubu" grubunun bir üyesi ise izni ver
        return request.user.groups.filter(name__in=['Admin', 'Proje Grubu']).exists()
