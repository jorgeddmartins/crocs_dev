# Create env variables to be used on run in thh CLI. Vars are set using the
# TF_VAR_${VAR_NAME} format, i.e. TF_VAR_PROJECT_SLUG=ProjectName terraform apply
variable "PROJECT_SLUG" {
  type = string
}

variable "PROJECT_REGION" {
  type    = string
  default = "westeurope"
}

variable "cdn_sku" {
  type        = string
  description = "CDN SKU names."
  default     = "Standard_Microsoft"
  validation {
    condition     = contains(["Standard_Akamai", "Standard_Microsoft", "Standard_Verizon", "Premium_Verizon"], var.cdn_sku)
    error_message = "The cdn_sku must be one of the following: Standard_Akamai, Standard_Microsoft, Standard_Verizon, Premium_Verizon."
  }
}

terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0.2"
    }
  }

  backend "azurerm" {}

  required_version = ">= 1.1.0"
}

# Configure Azure integration
provider "azurerm" {
  features {}
}

# Set up a resource group to contain the resources for this site.
resource "azurerm_resource_group" "rg" {
  name     = var.PROJECT_SLUG
  location = var.PROJECT_REGION
}

# static web app
resource "azurerm_static_site" "swa" {
  name                = azurerm_resource_group.rg.name
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  sku_tier            = "Standard"
  sku_size            = "Standard"
}

#cdn profile (only 1)
resource "azurerm_cdn_profile" "profile" {
  name                = "cdnprofile-${azurerm_resource_group.rg.name}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  sku                 = var.cdn_sku
}

#use regex to work out the environment specific urls
variable "search" { default = "/(.*)(\\..*\\.azurestaticapps.net)/" }

resource "azurerm_cdn_endpoint" "dev_endpoint" {
  name                          = "endpoint-dev-${azurerm_resource_group.rg.name}"
  profile_name                  = azurerm_cdn_profile.profile.name
  location                      = azurerm_resource_group.rg.location
  resource_group_name           = azurerm_resource_group.rg.name
  is_http_allowed               = true
  is_https_allowed              = true
  querystring_caching_behaviour = "NotSet"

  origin {
    name      = "devorigin"
    host_name = replace(azurerm_static_site.swa.default_host_name, var.search, "$1-dev.${var.PROJECT_REGION}$2")
  }
}

resource "azurerm_cdn_endpoint" "staging_endpoint" {
  name                          = "endpoint-staging-${azurerm_resource_group.rg.name}"
  profile_name                  = azurerm_cdn_profile.profile.name
  location                      = azurerm_resource_group.rg.location
  resource_group_name           = azurerm_resource_group.rg.name
  is_http_allowed               = true
  is_https_allowed              = true
  querystring_caching_behaviour = "NotSet"

  origin {
    name      = "stagingorigin"
    host_name = replace(azurerm_static_site.swa.default_host_name, var.search, "$1-staging.${var.PROJECT_REGION}$2")
  }
}

resource "azurerm_cdn_endpoint" "prod_endpoint" {
  name                          = "endpoint-prod-${azurerm_resource_group.rg.name}"
  profile_name                  = azurerm_cdn_profile.profile.name
  location                      = azurerm_resource_group.rg.location
  resource_group_name           = azurerm_resource_group.rg.name
  is_http_allowed               = true
  is_https_allowed              = true
  querystring_caching_behaviour = "NotSet"

  origin {
    name      = "prodorigin"
    host_name = azurerm_static_site.swa.default_host_name
  }
}
