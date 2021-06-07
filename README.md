# Projekt Technologie Chmurowe

Aplikacja podzielona jest na katalog "frontend" (React), "backend" (Express łączący się wewnątrz klastra z Mongo i Redisem) oraz "k8s" zawierający wszystkie pliki konfiguracyjne Kubernetesa. Aplikacja służy do dodawania i usuwania dowolnych komentarzy do bazy Mongo lub Redis. W Mongo dane są trwałe, a w Redisie ulotne. Frontend posiada trzy instancje, których ilość można zmniejszyć/zwiększyć według potrzeb, a Express i bazy danych po jednej.

## Uruchamianie projektu

Preliminaries

```
# Ensure ingress-nginx is running
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.46.0/deploy/static/provider/cloud/deploy.yaml
kubectl get pods -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx

# Ensure kube-dns is running
kubectl get services kube-dns --namespace=kube-system
```

/k8s

```
kubectl apply -f .
```

<http://localhost/>

# Namespaces

```
# Create namespaces
kubectl create namespace development
kubectl create namespace production

# Create context
kubectl config set-context dev --namespace=development --cluster=docker-desktop --user=docker-desktop
kubectl config set-context prod --namespace=production --cluster=docker-desktop --user=docker-desktop

# Switch between context
kubectl config use-context dev
kubectl config use-context prod

# Check current context
kubectl config current-context
kubectl config get-contexts
```

Zespół deweloperski pracuje nad kolejnymi wersjami aplikacji (w kontekście "dev", żeby nie trzeba było przy każdej komendzie używać flagi --namespace), a każda kolejna wersja jest publikowana za pomocą następujących komend:

/backend

```
docker build -t backend .
docker tag backend szymonwilczewski/tc-backend:<wersja>
docker push szymonwilczewski/tc-backend:<wersja>
```

/frontend

```
docker build -t frontend .
docker tag frontend szymonwilczewski/tc-frontend:<wersja>
docker push szymonwilczewski/tc-frontend:<wersja>
```

Następnie zmieniany jest tag w deploymencie i po uruchomieniu nowego deploymentu zmiany są widoczne w namespace deweloperskim

/k8s

```
kubectl apply -f .
```

Gdy aplikacja jest już gotowa i działa stabilnie zespół deweloperski publikuje "pełną wersję" aplikacji (np. Dev-1.0) i można zmienić tag w deploymencie w namespace produkcyjnym i wprowadzić zmiany

/prod

```
kubectl config use-context prod
kubectl apply -f .
```

W razie potrzeby zmiany można w łatwy sposób cofnąć poprzez komendy:

```
# Rollout history
kubectl rollout history deployment frontend-deployment

# Change rollout version
kubectl rollout undo deployment frontend-deployment [--to-revision=0]
```
