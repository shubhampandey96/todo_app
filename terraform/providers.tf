// terraform backend configuration
terraform {
  backend "s3" {
    bucket = "zaki-terraform-state-bucket"
    key = "terraform.tfstate"
    region = "ap-south-1"
  }
}


// provider terraform will use in this case, AWS
provider "aws" {
  region = var.aws_region

}