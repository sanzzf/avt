namespace AudioVisualModule.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class changeEventmodel3 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Events", "UserId", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Events", "UserId");
        }
    }
}
