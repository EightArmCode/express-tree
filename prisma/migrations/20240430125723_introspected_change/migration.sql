-- CreateTable
CREATE TABLE "Leaf" (
    "parentName" STRING,
    "name" STRING NOT NULL,
    "description" STRING NOT NULL,

    CONSTRAINT "Leaf_pkey" PRIMARY KEY ("name")
);

-- CreateIndex
CREATE UNIQUE INDEX "Leaf_name_key" ON "Leaf"("name");

-- AddForeignKey
ALTER TABLE "Leaf" ADD CONSTRAINT "Leaf_parentName_fkey" FOREIGN KEY ("parentName") REFERENCES "Leaf"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
